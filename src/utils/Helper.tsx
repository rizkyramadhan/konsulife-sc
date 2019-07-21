import RouteList from "@app/page/RouteList";

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

export const encodeSAPDate = function(dateval: string, separator: string) {
  let re = /-/gi;
  return dateval.replace(re, separator);
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

export const getParams: any = (path: string) => {
  let result: any = {};
  let fPattern: any = [];
  let aPath = path.split("/");
  Object.keys(RouteList).forEach(p => {
    let pattern = p.split("/");
    let status = true;
    if (pattern.length === aPath.length) {
      for (let i = 0; i < pattern.length; i++) {
        if (pattern[i].substring(0, 1) != ":" && pattern[i] != aPath[i]) {
          status = false;
        }
      }
      if (status) {
        fPattern = pattern;
      }
    }
  });
  fPattern.map((x: any, i: number) => {
    if (x.substring(0, 1) == ":") {
      if (x.substring(x.length - 1, x.length) == "?" && !!aPath[i]) {
        result[x.slice(1, x.length - 1)] = aPath[i];
      } else result[x.slice(1, x.length)] = aPath[i];
    }
  });
  return result;
};
