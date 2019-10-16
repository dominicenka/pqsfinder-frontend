import { EventEmitter } from "events";
import dispatcher from '../dispatcher';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class SubjectStore extends EventEmitter {
    constructor() {
        super();

        this.defaultOpts = {
            max_len: 0,
            min_score: 0,
            strandSense: true,
            strandAnti: true,
            loop_min_len: 0,
            loop_max_len: 0,
            max_bulges: 0,
            max_mismatches: 0,
            max_defects: 0,
            run_min_len: 0,
            run_max_len: 0
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
                max_len: data.max_len,
                min_score: data.min_score,
                strandSense: data.strand[0] === '*' || data.strand[0] === '+',
                strandAnti: data.strand[0] === '*' || data.strand[0] === '-',
                loop_min_len: data.loop_min_len,
                loop_max_len: data.loop_max_len,
                max_bulges: data.max_bulges,
                max_mismatches: data.max_mismatches,
                max_defects: data.max_defects,
                run_min_len: data.run_min_len,
                run_max_len: data.run_max_len
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
            this.version = res.data;
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
        let seq_description = data.slice(seqStartIndex, endLineIndex);
        data = data.slice(endLineIndex + 1);
        seqStartIndex = data.search(re);
        if (seqStartIndex === -1){
            result.push({
                seq_description: seq_description,
                seq_string: data, 
            });
            return [result, ''];
        };
        let seq_string = data.slice(0, seqStartIndex - 1);
        data = data.slice(seqStartIndex);
        result.push({
            seq_description: seq_description,
            seq_string: seq_string, 
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
        let dna_re = /^[ACGTMRWSYKVHDBN]+$/g;
        let rna_re = /^[ACGUMRWSYKVHDBN]+$/g;
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
            newSequence.seq_string = newSequence.seq_string.toUpperCase().trim().replace(/\r?\n|\r/g, '');
            if(newSequence.seq_description.search(/[*]/g) !== -1) {
                this.error = "Please do not use '*' in sequence description. We are working on removing this limitation.";
                this.emit("invalidInput");
                error = true;
                return {};
            }
            if(newSequence.seq_string.search(dna_re) === -1 && newSequence.seq_string.search(rna_re) === -1) {
                this.error = "Unexpected symbols in sequence " + newSequence.seq_description;
                this.emit("invalidInput");
                error = true;
                return {};
            }
            if (newSequence.seq_string.length > process.env.REACT_APP_MAX_BP) {
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