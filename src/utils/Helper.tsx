export const decodeSAPDate = function(dateval: string) {
    return [dateval.slice(0, 4), dateval.slice(4,6), dateval.slice(6,8)].join('-');
}

export const encodeSAPDate = function(dateval: string){
    let re = /-/gi;
    return dateval.replace(re, "");
}