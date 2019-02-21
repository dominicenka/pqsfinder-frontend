import { EventEmitter } from "events";
import dispatcher from '../dispatcher';
import axios from 'axios';

class ResultsStore extends EventEmitter {
    constructor(props) {
        super(props);
        this.results = [];
    }

    getResults() {
        return this.results;
    }

    fetchResults(ids) {
        console.log(ids);
        ids.results.forEach(resultId => {
            axios.get("http://127.0.0.1:8000/job/"+resultId).then(res => {
                this.parseResult(resultId, res.data);
            });
        });
    }

    parseInfo(data) {
        let template = {start: 6, end: 4, strand: 7, score: 6, nt: 3, nb: 3, nm: 3};
        let tmpData = {};
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

    parseResult(id, data) {
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
            [id]: {
                seq: seq,
                data: quadruplexes
            }
        };
        this.emit('fetched');
    }

    handleActions(action) {
        switch(action.type) {
            case "FETCH_RESULTS":   
                this.fetchResults(action.ids);
                break;
            default: 
                break;
        }
    }
}

const resultsStore = new ResultsStore();
dispatcher.register(resultsStore.handleActions.bind(resultsStore));
export default resultsStore;