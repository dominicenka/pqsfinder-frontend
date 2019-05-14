import { EventEmitter } from "events";
import dispatcher from '../dispatcher';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class SubjectStore extends EventEmitter {
    constructor() {
        super();

        this.defaultOpts = {
            maxLength: 0,
            minScore: 0,
            strandSense: true,
            strandAnti: true,
            minLL: 0,
            maxLL: 0,
            maxNB: 0,
            maxNM: 0,
            maxND: 0,
            minRL: 0,
            maxRL: 0
        }

        this.opts = {};
        this.input = '';
        this.id = '';
        this.error = '';
    }

    setDefaultOpts() {
        axios.get(`${API_URL}/formals`).then(res => {
            const data = res.data;
            this.opts = {
                maxLength: data.max_len[0],
                minScore: data.min_score,
                strandSense: data.strand[0] === '*' || data.strand[0] === '+',
                strandAnti: data.strand[0] === '*' || data.strand[0] === '-',
                minLL: data.loop_min_len,
                maxLL: data.loop_max_len,
                maxNB: data.max_bulges,
                maxNM: data.max_mismatches,
                maxND: data.max_defects,
                minRL: data.run_min_len,
                maxRL: data.run_max_len
            }
            this.emit("changeOpt");
            this.emit("networkOk");
        })
        .catch(error => {
            this.emit("serverError")
        });
        this.opts = this.defaultOpts;

        this.emit("changeOpt");
    }

    fetchVersion() {
        axios.get(`${API_URL}/version`).then(res => {
            this.version = res.data[0];
            this.emit("versionFetched");
            this.emit("networkOk");
        })
        .catch(error => {
            this.emit("serverError")
        });
    }

    getVersion() {
        return this.version;
    }

    getOpts() {
        return this.opts;
    }

    getInput() {
        return this.input;
    }

    getResults() {
        return this.id;
    }

    getError() {
        return this.error;
    }

    findSeq(data, result) {
        let re = /[>].*/g;
        let seqStartIndex = data.search(re);
        let endLineIndex = data.search('\n');
        if (endLineIndex === -1) {
            this.error = "Wrong input format. Please make sure every sequence name is terminated by a new line.";
            this.emit("invalidInput");
            return -1;
        }
        let seqDescription = data.slice(seqStartIndex, endLineIndex);
        data = data.slice(endLineIndex + 1);
        seqStartIndex = data.search(re);
        if (seqStartIndex === -1){
            result.push({
                seqDescription: seqDescription,
                dnaString: data, 
            });
            return [result, ''];
        };
        let dnaString = data.slice(0, seqStartIndex - 1);
        data = data.slice(seqStartIndex);
        result.push({
            seqDescription: seqDescription,
            dnaString: dnaString, 
        });
        return [result, data];
    }

    handleInput(data) {
        let re = /[>].*/g;
        if(data.search(re) === -1) {
            this.error = "Wrong data format";
            this.emit("invalidInput"); //wrong format
            return -1;
        }
        let result = [];
        while(data !== '') {
            let vals = this.findSeq(data, result);
            if (vals === -1) return -1;
            result = vals[0];
            data = vals[1];
        }

        return result;
    }

    analyze() {
        this.emit("fetching");
        let re2 = /^[ATGCMRWSYKVHDBN]+$/g;
        let opts = this.opts;
        let error = false;
        if ((opts.strandSense === true && opts.strandAnti === true) || (opts.strandSense === false && opts.strandAnti === false)) { 
            opts.strand = '*';
        }
        else if (opts.strandSense === true) {
            opts.strand = '+';
        }
        else {
            opts.strand = '-';
        }
        let sequences = this.handleInput(this.input);
        if (sequences === -1) return;
        sequences = sequences.map((sequence) => {
            let newSequence = {
                ...sequence
            };
            newSequence.dnaString = newSequence.dnaString.toUpperCase().trim().replace(/\r?\n|\r/g, '');
            if(newSequence.seqDescription.search(/[*]/g) !== -1) {
                this.error = "Please do not use '*' in sequence description. We are working on removing this limitation.";
                this.emit("invalidInput");
                error = true;
                return {};
            }
            if(newSequence.dnaString.search(re2) === -1) {
                this.error = "Unexpected symbols in nucleotide sequence";
                this.emit("invalidInput");
                error = true;
                return {};
            }
            if (newSequence.dnaString.length > 5000) {
                this.error = "Too long sequence";
                this.emit("invalidInput");
                error = true;
                return {};
            }
            return newSequence;
        });
        if(error) return;
        axios.post(`${API_URL}/analyze`, {opts: opts, sequences: sequences}).then(res => {
            this.id = res.data;

            this.emit("fetched");
            this.emit("serverFine")
        })
        .catch(error => {
            this.emit("serverError")
        });
    }

    changeOptValue(opt, value) {
        this.opts = {
            ...this.opts,
            [opt]: value,
        }

        this.emit("changeOpt");
    }

    changeInput(input) {
        this.input = input;

        this.emit("changeInput");
    }

    handleActions(action) {
        switch(action.type) {
            case "CHANGE_OPT_VALUE":
                this.changeOptValue(action.opt, action.value);
                break;
            case "CHANGE_INPUT":
                this.changeInput(action.value);
                break;
            case "ANALYZE":
                this.analyze();
                break;
            default: 
                break;
        }
    }

}

const subjectStore = new SubjectStore();
dispatcher.register(subjectStore.handleActions.bind(subjectStore));

export default subjectStore;