import dispatcher from '../dispatcher';

export function getSearchOpts(term) {
    dispatcher.dispatch({
        type: "GET_SEARCH_OPTS",
        term: term,
    })
}

export function getSearchOptsSuccess(term) {
    dispatcher.dispatch({
        type: "GET_SEARCH_OPTS_SUCCESS",
        term: term,
    })
}