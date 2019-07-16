export const decodeSAPDate = function(dateval: string) {
  return [dateval.slice(0, 4), dateval.slice(4, 6), dateval.slice(6, 8)].join(
    "-"
  );
};

export const decodeSAPDateToFormal = function(dateval: string) {
  return formatFormalDate(
    [dateval.slice(0, 4), dateval.slice(4, 6), dateval.slice(6, 8)].join("-")
  );
};

export const formatFormalDate = function(val: string) {
  let parts = val.split("-");
  var dateval = new Date(
    parseInt(parts[0]),
    parseInt(parts[1]) - 1,
    parseInt(parts[2])
  );

  var monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];

  var day = dateval.getDate();
  var monthIndex = dateval.getMonth();
  var year = dateval.getFullYear();

  return day + " " + monthNames[monthIndex] + " " + year;
};

export const encodeSAPDate = function(dateval: string) {
  let re = /-/gi;
  return dateval.replace(re, "");
};

export function getShortDate(date: Date, sperator: string = "-") {
  return (
    date.getFullYear() +
    sperator +
    lpad((date.getMonth() + 1).toString(), "0", 2) +
    sperator +
    lpad(date.getDate().toString(), "0", 2)
  );
}

export function lpad(str: string, padString: string, length: number) {
  while (str.length < length) {
    str = padString + str;
  }
  return str;
}
