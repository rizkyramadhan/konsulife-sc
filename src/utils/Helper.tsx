export const decodeSAPDate = function (dateval: string) {
    return [dateval.slice(0, 4), dateval.slice(4, 6), dateval.slice(6, 8)].join('-');
}

export const encodeSAPDate = function (dateval: string) {
    let re = /-/gi;
    return dateval.replace(re, "");
}

export function getShortDate(date: Date, sperator: string = "-") {
    return date.getFullYear() + sperator + lpad((date.getMonth() + 1).toString(), "0", 2) + sperator + lpad((date.getDate()).toString(), "0", 2);
}

export function lpad(str: string, padString: string, length: number) {
    while (str.length < length) {
        str = padString + str;
    }
    return str;
};