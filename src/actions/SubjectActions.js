import dispatcher from '../dispatcher';

export function changeOptValue(opt, value) {
    dispatcher.dispatch({
        type: "CHANGE_OPT_VALUE",
        opt: opt,
        value: value,
    })
}

export function changeInput(value) {
    dispatcher.dispatch({
        type: "CHANGE_INPUT",
        value: value,
    })
}

export function analyze() {
    dispatcher.dispatch({
        type: "ANALYZE",
    })
}