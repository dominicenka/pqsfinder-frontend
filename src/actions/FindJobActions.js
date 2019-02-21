import dispatcher from '../dispatcher';

export function changeJobId(val) {
    dispatcher.dispatch({
        type: "CHANGE_JOB_ID",
        val: val,
    })
}

export function fetchJob() {
    dispatcher.dispatch({
        type: "FETCH_JOB"
    })
}