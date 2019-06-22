import Axios from "axios";

// const urlDev: string = "http://mock.rx.plansys.co";
const url: string = "http://172.16.145.3:8087/MBGPService/Api/Search";

interface SearchProps {
  Table: string;
  Condition: {
    Field?: string;
    Values?: string | string[];
    Cond: string;
  }[];
  CustomQuery?: string;
  Fields?: string[];
  Sort?: string;
  Page?: number;
  Limit?: number
}

export const search = (p: SearchProps) => {
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
      if (c.Cond === "eq") {
        cond += `[${c.Field}]='${c.Value}'`;
      } else if (c.Cond === "ne") {
        cond += `[${c.Field}]<>'${c.Value}'`;
      } else if (c.Cond === "gt") {
        cond += `[${c.Field}]>'${c.Value}'`;
      } else if (c.Cond === "gte") {
        cond += `[${c.Field}]>='${c.Value}'`;
      } else if (c.Cond === "lt") {
        cond += `[${c.Field}]<'${c.Value}'`;
      } else if (c.Cond === "lte") {
        cond += `[${c.Field}]<='${c.Value}'`;
      } else if (c.Cond === "is") {
        cond += `[${c.Field}]is'${c.Value}'`;
      } else if (c.Cond === "in") {
        cond += `[${c.Field}]in'${Array.isArray(c.Value) ? c.Value.join(',') : c.Value}'`;
      } else if (c.Cond === "bw") {
        cond += `[${c.Field}]between'${Array.isArray(c.Value) ? c.Value.join(',') : c.Value}'`;
      } else if (c.Cond === "like") {
        cond += `[${c.Field}]like'~${c.Value}~'`;
      } else if (c.Cond === "nlike") {
        cond += `[${c.Field}]not like'~${c.Value}~'`;
      } else if (c.Cond === "~and") {
        cond += ` AND `;
      } else if (c.Cond === "~or") {
        cond += ` OR `;
      } else if (c.Cond === "~xor") {
        cond += ` XOR `;
      }
    });
  }

  params.Condition = cond;

  return new Promise((resolve, reject) => {
    Axios.get(url + '/' + JSON.stringify(params)).then(res => {
      resolve(res);
    }).catch(err => {
      console.log(err);
      reject(err);
    })
  })
};