import { EventEmitter } from "events";
import dispatcher from '../dispatcher';
import axios from 'axios';
import { saveAs } from 'file-saver';

const API_URL = process.env.REACT_APP_API_URL;

class ResultsStore extends EventEmitter {
    constructor(props) {
        super(props);
        this.results = {};
    }

    getResults() {
        return this.results;
    }

    fetchResults(id) {
        if(!id) return;
        if (this.results.id === id) {
            this.emit('fetched');
            return;
        }
        this.results = {};
        axios.get(`${API_URL}/job/${id}`).then(res => {
            if(res.data[0] === 0) {
                this.emit('invalidId');
                return;
            }
            this.results = {...this.results, id: id};
            this.parseFile(res.data);
            this.emit("networkOk");
            this.emit("validId");
        })
        .catch(error => {
            this.emit("serverError")
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
        let tmpData = { name: name};
        for (let[key, value] of Object.entries(template)) {
            let index = data.search(`;${key}`);  
            let val = data.slice(index+value+1);
            let semicolon = val.search(';');
            val = val.slice(0, semicolon);
            if (val !== '+' && val !== '-') val = Number(val);
            tmpData = {
                ...tmpData,
                [key]: val
            };
        }
        tmpData = {
            ...tmpData,
            length: tmpData.end - tmpData.start + 1
        };
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
        let length = data.substring(0, endLineIndex); // how many quadruplexes were found
        let noG4 = length === "0" ? true : false; 
        data = data.slice(endLineIndex + 1);
        while(1){
            let re = /[>]/g;
            let infoStart = data.search(re);
            endLineIndex = data.search('\n');
            if(noG4) {
                const name = data.slice(infoStart + 1, endLineIndex);
                this.results = {
                    ...this.results,
                    [name.replace(' ', '_').trim()]: {
                        name: name,
                        seq: seq,
                        data: []
                    }
                };
                this.emit('fetched');
                return;
            } 
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
            [info.name.replace(' ', '_').trim()]: {
                name: info.name,
                seq: seq,
                data: quadruplexes
            }
        };
        this.emit('fetched');
    }

    formatGRun(run, nt, strand) {
        const runLen = run.length;
        const defectCount = runLen - nt;
        const Gcount = strand === '+' ? (run.match(/G/g) || []).length : (run.match(/C/g) || []).length;
        const regex = strand === '+' ? /[^G]/gm : /[^C]/gm;

        if (Gcount === nt && runLen === nt) {
            return `${run}`;
        } else if (Gcount + 1 === nt) { //mismatch
            const pos = run.search(regex);
            return `${run.slice(0, pos)}${run.slice(pos, pos+1).toLowerCase()}${run.slice(pos+1)}`;
        } else { // bulge
            const match = run.match(regex);
            if (!match) {
                // all Gs or all Cs, but there is a bulge
                const defectLenHalf = Math.ceil((defectCount) / 2);
                const runLenHalf = Math.floor(runLen / 2);
                return `${run.slice(0, runLenHalf - defectLenHalf)}(${run.slice(runLenHalf - defectLenHalf, runLenHalf + defectLenHalf - 1)})${run.slice(runLenHalf + defectLenHalf - 1)}`;
            }; 
            let firstIndex = run.indexOf(match[0]);
            let lastIndex = run.lastIndexOf(match[match.length - 1]);
            let defect = run.slice(firstIndex, lastIndex + 1);
            if (defect.length < defectCount) { // bulge starts or ends with Gs or Cs
                let GsToAdd = defectCount - defect.length;
                const spaceAtTheEnd = runLen - 2 - lastIndex;
                if (spaceAtTheEnd) {
                    lastIndex += GsToAdd > spaceAtTheEnd ? spaceAtTheEnd : GsToAdd;
                    GsToAdd -= spaceAtTheEnd;
                }
                if (GsToAdd > 0) {
                    firstIndex -= GsToAdd;
                }
                defect = run.slice(firstIndex, lastIndex + 1);
            }
            return `${run.slice(0, firstIndex)}(${defect})${run.slice(lastIndex+1)}`;
        }
    }

    formatPQS(quad, seq_name) {
        const seq = this.results[seq_name].seq;
        const { start, end, strand, nt, rl1, rl2, rl3, ll1, ll2, ll3 } = quad;
        const whole_pqs = seq.slice(start - 1, end);
        let run1 = whole_pqs.slice(0, rl1);
        run1 = this.formatGRun(run1, nt, strand);
        let pos = rl1;
        const loop1 = whole_pqs.slice(pos, pos + ll1);
        pos += ll1;
        let run2 = whole_pqs.slice(pos, pos + rl2);
        run2 = this.formatGRun(run2, nt, strand);
        pos += rl2;
        const loop2 = whole_pqs.slice(pos, pos + ll2);
        pos += ll2;
        let run3 = whole_pqs.slice(pos, pos + rl3);
        run3 = this.formatGRun(run3, nt, strand);
        pos += rl3;
        const loop3 = whole_pqs.slice(pos, pos + ll3);
        pos += ll3;
        let run4 = whole_pqs.slice(pos);
        run4 = this.formatGRun(run4, nt, strand);
        let formatted = `[${run1}]${loop1}[${run2}]${loop2}[${run3}]${loop3}[${run4}]`;
        return formatted;
    }

    createGffFormat(name){
        let version = "##gff-version 3\n";
        let q = `"${name}"    pqsfinder   G_quartet`;
        let qs = [];
        qs.push(version);
        this.results[name].data.forEach(data => {
            qs.push(`${q}   ${data.start}   ${data.end} ${data.score}   ${data.strand}   .   nt=${data.nt};nb=${data.nb};nm=${data.nm};rl1=${data.rl1};rl2=${data.rl2};rl3=${data.rl3};ll1=${data.ll1};ll2=${data.ll2};ll3=${data.ll3}\n`);
        });
        var blob = new Blob(qs, {type: "text/plain;charset=utf-8"});
        saveAs(blob, `${name.replace(' ', '_')}.gff`);
    }

    createCsvFormat(name){
        let qs = [];
        qs.push("sequenceName,source,type,start,end,score,strand,pattern,nt,nb,nm,rl1,rl2,rl3,ll1,ll2,ll3\n");
        this.results[name].data.forEach(data => {
            qs.push(`"${name}",pqsfinder,G_quartet,${data.start},${data.end},${data.score},${data.strand},${this.formatPQS(data, name)},${data.nt},${data.nb},${data.nm},${data.rl1},${data.rl2},${data.rl3},${data.ll1},${data.ll2},${data.ll3}\n`);
        });
        var blob = new Blob(qs, {type: "text/plain;charset=utf-8"});
        saveAs(blob, `${name.replace(' ', '_')}.csv`);
    }

    exportGff(id){
        let version = "##gff-version 3\n";
        let qs = [];
        qs.push(version);
        for (let[key, value] of Object.entries(this.results)) {
            if(key === "id") continue;
            let q = `"${key}"    pqsfinder   G_quartet`;
            value.data.forEach(data => {
                qs.push(`${q}   ${data.start}   ${data.end} ${data.score}   ${data.strand}   .   nt=${data.nt};nb=${data.nb};nm=${data.nm};rl1=${data.rl1};rl2=${data.rl2};rl3=${data.rl3};ll1=${data.ll1};ll2=${data.ll2};ll3=${data.ll3}\n`);
            });
        }
        var blob = new Blob(qs, {type: "text/plain;charset=utf-8"});
        saveAs(blob, `${id.replace(' ', '_')}.gff`);
    }

    exportCsv(id){
        let qs = [];
        qs.push("sequenceName,source,type,start,end,score,strand,pattern,nt,nb,nm,rl1,rl2,rl3,ll1,ll2,ll3\n");
        for (let[key, value] of Object.entries(this.results)) {
            if (key === "id") continue;
            value.data.forEach(data => {
                qs.push(`"${key}",pqsfinder,G_quartet,${data.start},${data.end},${data.score},${data.strand},${this.formatPQS(data, key)},${data.nt},${data.nb},${data.nm},${data.rl1},${data.rl2},${data.rl3},${data.ll1},${data.ll2},${data.ll3}\n`);
            });
        }
        var blob = new Blob(qs, {type: "text/plain;charset=utf-8"});
        saveAs(blob, `${id.replace(' ', '_')}.csv`);
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
            case "EXPORT_GFF_ALL":   
                this.exportGff(action.id);
                break;
            case "EXPORT_CSV_ALL":   
                this.exportCsv(action.id);
                break;
            default: 
                break;
        }
    }
}

const resultsStore = new ResultsStore();
dispatcher.register(resultsStore.handleActions.bind(resultsStore));
export default resultsStore;