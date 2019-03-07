import { EventEmitter } from "events";
import dispatcher from '../dispatcher';
import axios from 'axios';
import { saveAs } from 'file-saver';

class ResultsStore extends EventEmitter {
    constructor(props) {
        super(props);
        this.results = {};
    }

    getResults() {
        return this.results;
    }

    fetchResults(id) {
        this.results = {};
        axios.get("http://127.0.0.1:8000/job/"+id).then(res => {
            if(res.data[0] === 0) {
                this.emit('invalidId');
                return;
            }
            this.results = {...this.results, id: id};
            this.parseFile(res.data);
        });
    }

    parseFile(file) {
        let startSeq = file.search(/[*]/g);
        file = file.slice(startSeq + 2);
        while(1) {
            startSeq = file.search(/[*]/g);
            if (startSeq === -1) break;
            let seq = file.slice(0, startSeq - 1);
            this.parseResult(seq);
            file = file.slice(startSeq + 2);
        }
        this.parseResult(file);
    }

    parseInfo(data) {
        let template = {start: 6, end: 4, strand: 7, score: 6, nt: 3, nb: 3, nm: 3, rl1: 4, rl2: 4, rl3: 4, ll1: 4, ll2:4, ll3: 4};
        let name = data.slice(2, data.search(/[;]/g));
        let tmpData = { name: name };
        for (let[key, value] of Object.entries(template)) {
            let index = data.search(key);  
            let val = data.slice(index+value);
            let semicolon = val.search(';');
            val = val.slice(0, semicolon);
            tmpData = {
                ...tmpData,
                [key]: val
            };
        }
        return tmpData;
    }   

    parseResult(data) {
        let key = 0;
        let info = '';
        let quadruplexes = [];
        let endLineIndex = data.search('\n');
        let seq = data.slice(0, endLineIndex); // whole dna seq
        data = data.slice(endLineIndex + 1);
        endLineIndex = data.search('\n');
        data = data.slice(endLineIndex + 1);
        while(1){
            let re = /[>]/g;
            let infoStart = data.search(re);
            endLineIndex = data.search('\n');
            info = this.parseInfo(data.slice(infoStart, endLineIndex)); // info
            data = data.slice(endLineIndex + 1);
            endLineIndex = data.search('\n');
            if(endLineIndex === -1) break;
            let quadruplex = data.slice(0, endLineIndex);
            data = data.slice(endLineIndex + 1);
            quadruplexes.push(Object.assign(info, {
                quadruplex: quadruplex,
                key: ++key
            }));
        }
        quadruplexes.push(Object.assign(info, {
            quadruplex: data,
            key: ++key
        }));
        this.results = {
            ...this.results,
            [info.name]: {
                seq: seq,
                data: quadruplexes
            }
        };
        this.emit('fetched');
    }

    createGffFormat(name){
        let version = "##gff-version 3\n";
        let q = `${name}    pqsfinder   G_quartet`;
        let qs = [];
        qs.push(version);
        this.results[name].data.forEach(data => {
            qs.push(`${q}   ${data.start}   ${data.end} ${data.score}   ${data.strand}   .   nt=${data.nt};nb=${data.nb};nm=${data.nm};rl1=${data.rl1};rl2=${data.rl2};rl3=${data.rl3};ll1=${data.ll1};ll2=${data.ll2};ll3=${data.ll3}\n`);
        });
        var blob = new Blob(qs, {type: "text/plain;charset=utf-8"});
        saveAs(blob, `${name.replace(' ', '_')}.gff`);
    }

    createCsvFormat(name){
        let q = `${name},pqsfinder,G_quartet`;
        let qs = [];
        this.results[name].data.forEach(data => {
            qs.push(`${q},start=${data.start},end=${data.end},score=${data.score},strand=${data.strand},nt=${data.nt},nb=${data.nb},nm=${data.nm},rl1=${data.rl1},rl2=${data.rl2},rl3=${data.rl3},ll1=${data.ll1},ll2=${data.ll2},ll3=${data.ll3}\n`);
        });
        var blob = new Blob(qs, {type: "text/plain;charset=utf-8"});
        saveAs(blob, `${name.replace(' ', '_')}.csv`);
    }

    handleActions(action) {
        switch(action.type) {
            case "FETCH_RESULTS":   
                this.fetchResults(action.ids);
                break;
            case "EXPORT_GFF":   
                this.createGffFormat(action.name);
                break;
            case "EXPORT_CSV":   
                this.createCsvFormat(action.name);
                break;
            default: 
                break;
        }
    }
}

const resultsStore = new ResultsStore();
dispatcher.register(resultsStore.handleActions.bind(resultsStore));
export default resultsStore;