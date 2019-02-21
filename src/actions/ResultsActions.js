import dispatcher from '../dispatcher';

export function fetchResults(ids) {
    dispatcher.dispatch({
        type: "FETCH_RESULTS",
        ids: ids,
    })
}