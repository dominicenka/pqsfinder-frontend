import { EventEmitter } from "events";
import dispatcher from '../dispatcher';
import axios from 'axios';

class SubjectStore extends EventEmitter {
    constructor() {
        super();

        this.defaultOpts = {
            maxLength: 50,
            minScore: 26,
            strandSense: true,
            strandAnti: true,
            minLL: 0,
            maxLL: 30,
            maxNB: 3,
            maxNM: 3,
            maxND: 3
        }

        this.opts = {};
        this.input = '';
    }

    setDefaultOpts() {
        this.opts = this.defaultOpts;

        this.emit("changeOpt");
    }

    getOpts() {
        return this.opts;
    }

    getInput() {
        return this.input;
    }

    findSeq(data, result) {
        let re = /[>].*/g;
        let seqStartIndex = data.search(re);
        let endLineIndex = data.search('\n');
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
            console.log('wrong format');
            return -1;
        }
        let result = [];
        while(data !== '') {
            let vals = this.findSeq(data, result);
            result = vals[0];
            data = vals[1];
        }

        return result;
    }

    analyze() {
        let re2 = /^[ATGC]+$/g;
        let opts = this.opts;
        if (!this.opts.strandSense && !this.opts.strandAnti) this.opts.strandSense = true;
        let sequences = this.handleInput(this.input);
        if (sequences === -1) return;
        console.log(sequences);
        sequences = sequences.map((sequence) => {
            let newSequence = {
                ...sequence
            };
            newSequence.dnaString = newSequence.dnaString.toUpperCase().trim().replace(/\r?\n|\r/g, '');
            if(newSequence.dnaString.search(re2) === -1) {
                alert('unaccepted symbols');
                return;
            }
            return newSequence;
        });

        axios.post("http://127.0.0.1:8000/analyze", {opts: opts, sequences: sequences})
            .then(res => {
                console.log(res);
            })
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