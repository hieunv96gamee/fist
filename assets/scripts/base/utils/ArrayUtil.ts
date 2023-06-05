import MathUtil from "./MathUtil";

export default class ArrayUtil {
    public static shuffle(a) {
        let j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }

    public static maxOf(arr, compareFunc?): number {
        if (compareFunc === undefined) {
            compareFunc = function (a, b) {
                return a > b
            }
        }
        let max = arr[0];
        for (let i = 1; i < arr.length; i++) {
            if (compareFunc(arr[i], max)) {
                max = arr[i];
            }
        }
        return max;
    }

    public static getShuffleArray(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    public static removeElement(arr, e) {
        let index = arr.indexOf(e);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }

    public static removeElements(arr, _arr) {
        _arr.forEach(function (e) {
            this.removeElement(arr, e);
        }.bind(this));
    }

    public static moveElementFromTo(arr, from, to) {
        let numberCards = arr.length;
        if (numberCards < 2) {
            return;
        }
        if (from < 0 || to < 0 || from > numberCards - 1 || to > numberCards - 1 || from === to) {
            return;
        }
        arr.splice(to, 0, arr.splice(from, 1)[0]);
    }

    public static swapElement(arr, i, j) {
        if (i === j) return;
        let tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    public static swapRandomElement(arr) {
        let n = arr.length;
        if (n < 2) {
            return;
        }
        for (let i = 0; i < n; i++) {
            let b;
            do {
                b = Math.floor(Math.random() * n);
            } while (i === b);
            this.swapElement(arr, i, b);
        }
    }

    count(arr, countFunc) {
        let count = 0;
        arr.forEach(function (e) {
            if (countFunc(e)) {
                count++;
            }
        });
        return count;
    }

    sortAscending_CardUIArray(arr) {
        arr.sort(function (a, b) {
            return a.id - b.id;
        });
    }

    sortGroup_CardUIArray(arr) {
        ArrayUtil.shuffle(arr);
    }

    indexOfMax(arr, compareFunc) {
        if (compareFunc === undefined) {
            compareFunc = function (a, b) {
                return a > b
            }
        }
        let pmax = 0;
        for (let i = 1; i < arr.length; i++) {
            if (compareFunc(arr[i], arr[pmax])) {
                pmax = i;
            }
        }
        return pmax;
    }

    firstIndexOf(arr, conditionFunc) {
        for (let i = 0; i < arr.length; i++) {
            if (conditionFunc(arr[i])) {
                return i;
            }
        }
        return -1;
    }

    lastIndexOf(arr, conditionFunc) {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (conditionFunc(arr[i])) {
                return i;
            }
        }
        return -1;
    }

    public static sumOf(arr: number[]) {
        return arr.reduce((a, b) => a + b);
    }

    static isStringInNoUpperLowerDistinguish(str: string, arr: string[]) {
        let lStr = str.toLowerCase();
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].toLowerCase();
        }
        return arr.indexOf(lStr) >= 0;
    }

    static getRandomTwoSwapIndex(len: number): { first: number, sec: number } {
        let first = MathUtil.randomInt(len);
        let second = MathUtil.randomInt(len);
        if (first === second) {
            second = second + 1;
            if (second === len) {
                second = second - 2;
            }
            second = second >= 0 ? second : 0;
        }
        return {
            first: first,
            sec: second
        }
    }

    /***
     *
     * @param arr -- increase array
     * @param value --
     * @param mulTime
     */
    static findMaxLessThan(arr: number[], value: number, mulTime: number = 1) {
        for (let i = arr.length - 1; i > 0; i--) {
            if (arr[i] * mulTime <= value) {
                return i;
            }
        }
        return -1;
    }

    static getClone2DArray(arr: number[][]) {
        let ret = [];
        for (let i = 0; i < arr.length; i++) {
            ret.push(arr[i].slice(0));
        }
        return ret;
    }

    static getClone1DArray(arr: number[]) {
        return [].concat(arr)
    }

    static get2DArrayOf1D(arr: number[], numEachColumn: number): number[][] {
        let ret = [];
        let numColumn = Math.floor(arr.length / numEachColumn);
        for (let i = 0; i < numColumn; i++) {
            let c = [];
            let start = i * numEachColumn;
            let end = start + numEachColumn;
            for (let j = start; j < end; j++) {
                c.push(arr[j]);
            }
            ret.push(c);
        }
        return ret;
    }

    static concatNoDuplicate(arr1, arr2) {
        let arr = [].concat(arr1);
        for (let i = 0; i < arr2.length; i++) {
            if (arr.indexOf(arr2[i]) < 0) {
                arr.push(arr2[i]);
            }
        }
        return arr;
    }

}