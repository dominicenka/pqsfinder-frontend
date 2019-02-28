import dispatcher from '../dispatcher';

export function fetchResults(ids) {
    dispatcher.dispatch({
        type: "FETCH_RESULTS",
        ids: ids,
    })
}

export function exportGff(name) {
    dispatcher.dispatch({
        type: "EXPORT_GFF",
        name: name,
    })
}

export function exportCsv(name) {
    dispatcher.dispatch({
        type: "EXPORT_CSV",
        name: name,
    })
}