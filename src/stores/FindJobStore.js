import { EventEmitter } from "events";
import dispatcher from '../dispatcher';

class FindJobStore extends EventEmitter {
    constructor(props) {
        super(props);

        this.jobId = [];
    }

    changeJobId(val) {
        this.jobId[0] = val;
        this.emit('changeJobId');
    }

    getJobId() {
        console.log(this.jobId);
        return this.jobId;
    }

    fetchJob() {
        
    }

    handleActions(action) {
        switch(action.type) {
            case "FETCH_JOB":   
                this.fetchJob(action.id);
                break;
            case "CHANGE_JOB_ID":   
                this.changeJobId(action.val);
                break;
            default: 
                break;
        }
    }

}

const findJobStore = new FindJobStore();
dispatcher.register(findJobStore.handleActions.bind(findJobStore));
export default findJobStore;