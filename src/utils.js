let Utils = {

    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        if (obj === undefined) return true;
        return true;
    },

    onlyUnique(arr) {
        return arr.filter((value, index, self) => self.indexOf(value) === index);
    }

}

export default Utils;