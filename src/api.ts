import Axios from "axios";

// const urlDev: string = "http://mock.rx.plansys.co";
const url: string = "http://172.16.145.3:8087/MBGPService/Api/Search";

export interface APISearchProps {
  Table: string;
  Condition?: {
    field?: string;
    value?: any | any[];
    cond: string;
  }[];
  CustomQuery?: string;
  Fields?: string[];
  Sort?: string;
  Page?: number;
  Limit?: number;
}

export const APISearch = (p: APISearchProps) => {
  const params = {
    CustomQuery: p.CustomQuery ? p.CustomQuery : "",
    Fields: "",
    Table: p.Table,
    Condition: "",
    Sort: p.Sort ? p.Sort : "",
    Page: p.Page ? p.Page : 1,
    Limit: p.Limit ? p.Limit : 10
  };

  if (!!p.Fields && p.Fields.length > 0) {
    params.Fields = p.Fields.join(",");
  }

  let cond: string = "";
  if (!!p.Condition && p.Condition.length > 0) {
    p.Condition.forEach((c: any) => {
      if (c.cond === "AND" || c.cond === "OR" || c.cond === "XOR") {
        cond += ` ${c.cond} `;
      } else {
        let val = parseInt(c.value) != NaN ? parseInt(c.value) : `'${c.value}'`; 
        cond += `[${c.field}] ${c.cond} ${val}`;
      }
    });
  }

  params.Condition = cond;

  return new Promise((resolve, reject) => {
    Axios.post(url, JSON.stringify(params), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((res: any) => {
        console.log(res);
        resolve(res);
      })
      .catch((err: any) => {
        console.log(err);
        reject(err);
      });
  });
};
