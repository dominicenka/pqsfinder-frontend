import { EventEmitter } from "events";
import dispatcher from '../dispatcher';
import XMLParser from 'react-xml-parser';
import Utils from '../utils.js';

const NCBI_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

class NCBIStore extends EventEmitter {
    constructor(props) {
        super(props);

        this.searchOpts = [];
        this.selectedOption = {};
        this.length = 0;
    }

    setSelectedOption(option) {
        this.selectedOption = option;
    }

    setLength(length) {
        this.length = length;
    }

    getSearchOptions() {
        return this.searchOpts;
    }

    getSequence() {
        return this.sequence;
    }

    async fetchSearchOptions(term) {
        if(term.length < 3) return;
        await fetch(`${NCBI_URL}/esearch.fcgi?db=gene&term=${term}&sort=relevance`
        ).then(res => {
            return res.text();
        }).then(xmlText => {
            var xml = new XMLParser().parseFromString(xmlText);
            return this.parseIdsXML(xml);
        })
          .catch(function (error) {
            console.log(error);
          });
    }

    async parseIdsXML(data) {
        const ids = data.getElementsByTagName('Id').map(object => object.value);
        await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=${ids.join(',')}`)
        .then(res => {
            return res.text();
        })
        .then(xmlText => {
            return this.parseNCBIObjects(xmlText);
        })
        .catch(function (error) {
            console.log(error);
          });
    }

    parseNCBIObjects(data) {
        var xml = new XMLParser().parseFromString(data);
        let newData = xml.getElementsByTagName('DocumentSummary').filter(object => object.getElementsByTagName('Status')[0].value === '0')
        .map(object => {
            const locationHist = object.getElementsByTagName('LocationHist')[0].children[0];
            const genomicInfo = object.getElementsByTagName('GenomicInfo')[0].getElementsByTagName('GenomicInfoType')[0];
            return {
                label: `${object.getElementsByTagName('Description')[0].value}, ${object.getElementsByTagName('OtherAliases')[0].value}`,
                value: genomicInfo ? genomicInfo.getElementsByTagName('ChrAccVer')[0].value : locationHist.getElementsByTagName('ChrAccVer')[0].value,
                // value: object.attributes.uid,
                chrStart: genomicInfo ? genomicInfo.getElementsByTagName('ChrStart')[0].value : locationHist.getElementsByTagName('ChrStart')[0].value,
                chrStop: genomicInfo ? genomicInfo.getElementsByTagName('ChrStop')[0].value : locationHist.getElementsByTagName('ChrStop')[0].value
            }
        });
        // console.log(newData);
        this.searchOpts = newData;
        return;
    }

    fetchSequence() {
        // console.log(this.selectedOption);
        if(Utils.isEmpty(this.selectedOption)) return;
        const length = this.length ? this.length : 0;
        // console.log(this.length);
        fetch(`http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${this.selectedOption.value}&seq_start=${this.selectedOption.chrStart}&seq_stop=${this.selectedOption.chrStart+length}&rettype=fasta&retmode=text`)
        .then(res => res.text())
        .then(text => {
            this.sequence = text;
            this.emit("NCBISeqFetched");
        })
        .catch(function (error) {
            console.log(error);
          });
    }

    handleActions(action) {
        switch(action.type) {
            case "GET_SEARCH_OPTS":
                this.fetchSearchOptions(action.term);
                break;
            default: 
                break;
        }
    }

}

const nCBIStore = new NCBIStore();
dispatcher.register(nCBIStore.handleActions.bind(nCBIStore));
export default nCBIStore;