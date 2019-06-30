import Axios from "axios";
// import createRecord from './libs/gql/data/createRecord';
// import query from './libs/gql/data/query';
// import updateRecord from './libs/gql/data/updateRecord';
import config from './config';

// const urlDev: string = "http://mock.rx.plansys.co";

export interface APISearchProps {
  Table?: string;
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
  Cache?: any;
}

export const APISearch = async (p: APISearchProps) => {
  const params = {
    CustomQuery: p.CustomQuery ? p.CustomQuery : "",
    Fields: "",
    Table: p.Table,
    Condition: "",
    Sort: p.Sort ? p.Sort : "",
    Page: p.Page ? p.Page : 1,
    Limit: p.Limit ? p.Limit : 0
  };

  if (!!p.Fields && p.Fields.length > 0) {
    params.Fields = p.Fields.join(",");
  } else {
    params.Fields = "*";
  }

  let cond: string = "";
  if (!!p.Condition && p.Condition.length > 0) {
    p.Condition.forEach((c: any) => {
      if (c.cond === "AND" || c.cond === "OR" || c.cond === "XOR") {
        cond += ` ${c.cond} `;
      }
      else if (c.cond === "IN") {
        let value: any;
        if (Array.isArray(c.value)) {
          value = c.value.map(function (val: any) {
            return val !== null ? "'" + val + "'" : "NULL";
          }).join(",");
        }
        else {
          value = c.value;
        }
        cond += `[${c.field}] ${c.cond} (${value})`;
      }
      else {
        let val = typeof c.value == "number" ? parseInt(c.value) : `'${c.value}'`;
        cond += `[${c.field}] ${c.cond} ${val}`;
      }
    });
  }

  params.Condition = cond;

  return new Promise(async (resolve, reject) => {
    let url = config.wsSAP + "Search";
    // const cache = await query("cache", ['data'], { where: { id: config.wsSAP + "Search" + params.Table + params.Condition } });
    // if (cache) resolve(cache.data);

    Axios.post(url, JSON.stringify(params), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((res: any) => {
        if (typeof res.data == 'object' && !!res.data && !!res.data.ErrorCode) {
          reject();
        } else {
          // if (!cache || (Array.isArray(cache.data) && cache.data.length === 0)) {
          //   createRecord("cache", {
          //     id: url + params.Table + params.Condition,
          //     data: res.data
          //   })
          // } else {
          //   updateRecord("cache", {
          //     id: url + params.Table + params.Condition,
          //     data: res.data
          //   });
          // }
          resolve(res.data)
        }
      })
      .catch((err: any) => {
        console.error(err);
        reject();
      });
  });
};

export const APIPost = (api: string, data: any) => {
  return new Promise((resolve, reject) => {
    Axios.post(config.wsSAP + api, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((res: any) => {
        if (typeof res.data == 'object' && !!res.data && !!res.data.ErrorCode) {
          reject(res.data);
        }
        resolve(res.data);
      })
      .catch((err: any) => {
        console.error(err);
        reject(err);
      });
  });
};

export const SAPFieldMap = {
  Series: {
    Table: "NNM1",
    Fields: ['Series', 'SeriesName'],
    Condition: [{
      field: 'ObjectCode',
      value: 2,
      cond: '=',
    }]
  } as APISearchProps,
  BPGroup: {
    Table: "OCRG",
    Fields: ['GroupCode', 'GroupName'],
    Condition: [{
      field: 'GroupType',
      value: 'C',
      cond: '=',
    }]
  } as APISearchProps,
  Currency: {
    Table: "OCRN",
    Fields: ["CurrCode", "CurrName"]
  } as APISearchProps,
  Area: {
    Table: "OPRC",
    Fields: ["PrcCode", "PrcName"],
    Condition: [{
      field: "DimCode",
      cond: "=",
      value: 1
    }]
  } as APISearchProps,
  Branch: {
    Table: "OPRC",
    Fields: ["PrcCode", "PrcName"],
    Condition: [{
      field: "DimCode",
      cond: "=",
      value: 2
    }]
  } as APISearchProps,
  State: {
    Table: "OCST",
    Fields: ["Code", "Name"],
    Condition: [{
      field: "Country",
      cond: "=",
      value: "ID"
    }]
  } as APISearchProps,
  CustomerCode: {
    Table: "OCRD",
    Fields: ["CardCode", "CardName", "Currency", "GroupNum"],
    Condition: [{
      field: "CardType",
      cond: "IN",
      value: ["C", "L"]
    },
    {
      cond: "AND"
    },
    {
      field: "U_IDU_BRANCH",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  DocumentRate: {
    Table: "ORTT",
    Fields: ['Rate'],
    Condition: [
      {
        field: 'Currency',
        value: '',
        cond: '='
      },
      {
        cond: 'AND'
      },
      {
        field: 'RateDate',
        value: '',
        cond: '='
      }
    ]
  } as APISearchProps,
  PaymentTerms: {
    Table: "OCTG",
    Fields: ["GroupNum", "PymntGroup"],
  } as APISearchProps,
  PaymentTermsCust: {
    Table: "OCRD",
    Fields: ["GroupNum"],
    Condition: [{
      field: "CardCode",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  ContactPerson: {
    Table: "OCPR",
    Fields: ["Name", "FirstName", "MiddleName", "LastName"],
    Condition: [{
      field: "CardCode",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  SalesAsEmployee: {
    Table: "OCRD",
    Fields: ["CardCode", "CardName"],
    Condition: [{
      field: "U_SALES",
      cond: "=",
      value: "Y"
    }]
  } as APISearchProps,
  ShipTo: {
    Table: "CRD1",
    Fields: ["Address", "Street", "City"],
    Condition: [{
      field: "CardCode",
      cond: "=",
      value: ""
    },
    {
      cond: "AND"
    },
    {
      field: "AdresType",
      cond: "=",
      value: "S"
    }]
  } as APISearchProps,
  BillTo: {
    Table: "CRD1",
    Fields: ["Address", "Street", "City"],
    Condition: [{
      field: "CardCode",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  TaxCode: {
    Table: "OVTG",
    Fields: ["Code", "Name"],
    Condition: [{
      field: "Inactive",
      cond: "=",
      value: "N"
    },
    {
      cond: "AND"
    },
    {
      field: "Category",
      cond: "=",
      value: "Output Tax"
    }]
  } as APISearchProps,
  ItemCodeCanvas: {
    Table: "OITM",
    Fields: ["ItemCode", "ItemName"],
    CustomQuery: "ItemCodeCanvas",
    Condition: [{
      field: "U_BRANCH",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  ItemCodeAll: {
    Table: "OITM",
    Fields: ["ItemCode", "ItemName", "U_IDU_PARTNUM", "VatGourpSa", "SUoMEntry", "IUoMEntry", "CstGrpCode"]
  } as APISearchProps,
  UomCode: {
    Table: "OUOM",
    Fields: ["UomEntry", "UomName"]
  } as APISearchProps,
  WarehouseCodeCanvas: {
    Table: "OWHS",
    Fields: ["WhsCode"],
    Condition: [{
      field: "U_BRANCH",
      cond: "=",
      value: ""
    },
    {
      cond: 'AND'
    },
    {
      field: "U_IDU_WHSETYPE",
      cond: "=",
      value: "Canvassing"
    }]
  } as APISearchProps,
  WarehouseCodeAll: {
    Table: "OWHS",
    Fields: ["WhsCode"],
    // Condition: [{
    //   field: "U_BRANCH",
    //   cond: "=",
    //   value: ""
    // }]
  } as APISearchProps,
  OcrCode: {
    Table: "OPRC",
    Fields: ["PrcCode"],
    Condition: [{
      field: "DimCode",
      cond: "=",
      value: "1"
    }]
  } as APISearchProps,
  OcrCode2: {
    Table: "OPRC",
    Fields: ["PrcCode"],
    Condition: [{
      field: "DimCode",
      cond: "=",
      value: "2"
    }]
  } as APISearchProps,
  TaxCodeSO: {
    Table: "OITM",
    Fields: ["VatGourpSa"],
    Condition: [{
      field: "ItemCode",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  SAPSalesCode: {
    Table: "OSLP",
    Fields: ["SlpCode", "SlpName"]
  } as APISearchProps,
  SAPSalesCodeUser: {
    Table: "OSLP",
    Fields: ["SlpCode", "SlpName"],
    Condition: [{
      field: "SlpCode",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  PartNumber: {
    Table: "OITM",
    Fields: ["U_IDU_PARTNUM"],
    Condition: [{
      field: "ItemCode",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  VendorCode: {
    Table: "OCRD",
    Fields: ["CardCode", "CardName"],
    Condition: [{
      field: "CardType",
      cond: "=",
      value: "S"
    }]
  } as APISearchProps,
  POHeader: {
    Table: "OPOR",
    Fields: ["DocNum", "CardCode", "CardName", "U_IDU_PO_INTNUM", "U_IDU_SUP_SONUM", "U_BRANCH", "Comments"],
    Condition: [{
      field: "CardCode",
      cond: "=",
      value: ""
    },
    {
      cond: "AND"
    },
    {
      field: "DocStatus",
      cond: "=",
      value: "O"
    }]
  } as APISearchProps,
  PODetail: {
    Table: "POR1",
    Fields: ["LineNum", "DocEntry", "ItemCode", "ItemName", "U_IDU_PARTNUM", "WhsCode", "Quantity", "UnitMsr", "OpenCreQty"],
    Condition: [{
      field: "DocEntry",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  SOHeader: {
    Table: "ORDR",
    Fields: ["DocNum", "CardCode", "CardName", "U_IDU_SO_INTNUM", "U_BRANCH", "Comments"],
    Condition: [{
      field: "CardCode",
      cond: "=",
      value: ""
    },
    {
      cond: "AND"
    },
    {
      field: "DocStatus",
      cond: "=",
      value: "O"
    }]
  } as APISearchProps,
  SODetail: {
    Table: "RDR1",
    Fields: ["LineNum", "DocEntry", "ItemCode", "ItemName", "U_IDU_PARTNUM", "WhsCode", "Quantity", "UnitMsr", "OpenCreQty"],
    Condition: [{
      field: "DocEntry",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  DOHeader: {
    Table: "ODLN",
    Fields: ["DocNum", "CardCode", "CardName", "U_IDU_DO_INTNUM", "U_BRANCH", "Comments"],
    Condition: [{
      field: "CardCode",
      cond: "=",
      value: ""
    },
    {
      cond: "AND"
    },
    {
      field: "DocStatus",
      cond: "=",
      value: "O"
    }]
  } as APISearchProps,
  DODetail: {
    Table: "DLN1",
    Fields: ["LineNum", "DocEntry", "ItemCode", "ItemName", "U_IDU_PARTNUM", "WhsCode", "Quantity", "UnitMsr", "OpenCreQty"],
    Condition: [{
      field: "DocEntry",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  UoMGroup: {
    Table: "OUGP",
    Fields: ["UgpCode", "UgpName"]
  } as APISearchProps,
  ITRHeader: {
    Table: "OWTQ",
    Fields: ["DocNum", "CardCode", "CardName", "U_IDU_ITR_INTNUM", "Filler", "ToWhsCode", "U_BRANCH", "Comments"],
    Condition: [{
      field: "Filler",
      cond: "=",
      value: ""
    },
    {
      cond: "AND"
    },
    {
      field: "DocStatus",
      cond: "=",
      value: "O"
    }]
  } as APISearchProps,
  ITRDetail: {
    Table: "WTQ1",
    Fields: ["ItemCode", "ItemName", "U_IDU_PARTNUM", "WhsCode", "Quantity", "UnitMsr", "OpenCreQty"],
    Condition: [{
      field: "DocEntry",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  ChartOfAccount: {
    Table: "OACT",
    Fields: ["AcctCode", "AcctName"],
    Condition: [{
      field: "Finanse",
      cond: "=",
      value: "Y"
    }]
  } as APISearchProps,
}