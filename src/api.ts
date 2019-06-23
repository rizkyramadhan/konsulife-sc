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
  } else {
    params.Fields = "*";
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
        resolve(res);
      })
      .catch((err: any) => {
        console.log(err);
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
    Fields: ["Code", "Name"]
  } as APISearchProps,
  CustomerCode: {
    Table: "OCRD",
    Fields: ["BPCode", "BPName"],
    Condition: [{
      field: "GroupType",
      cond: "=",
      value: "C"
    },
    {
      cond: "OR"
    },
    {
      field: "GroupType",
      cond: "=",
      value: "L"
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
    Fields: ["Name"],
    Condition: [{
      field: "CardCode",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  ShipTo: {
    Table: "CRD1",
    Fields: ["Address"],
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
    Fields: ["Address"],
    Condition: [{
      field: "CardCode",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  TaxCode: {
    Table: "OVTG",
    Fields: ["Code", "TaxCode"],
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
      value: "Outpaut Tax"
    }]
  } as APISearchProps,
  ItemCodeAll: {
    Table: "OITM",
    Fields: ["ItemCode", "ItemName"]
  } as APISearchProps,
  UoMCode: {
    Table: "OUOM",
    Fields: ["UoMCode", "UoMName"],
    Condition: [{
      field: "CardCode",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  WarehouseCodeCanvas: {
    Table: "OWHS",
    Fields: ["WhsCode", "WhsName"],
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
    Fields: ["WhsCode", "WhsName"],
    Condition: [{
      field: "U_BRANCH",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  OcrCode: {
    Table: "OCRD",
    Fields: ["U_IDU_AREA"],
    Condition: [{
      field: "CardCode",
      cond: "=",
      value: ""
    }]
  } as APISearchProps,
  OcrCode2: {
    Table: "OCRD",
    Fields: ["U_IDU_BRANCH"],
    Condition: [{
      field: "CardCode",
      cond: "=",
      value: ""
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
    Fields: ["SlpCode"],
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
    Fields: ["BPCode", "BPName"],
    Condition: [{
      field: "GroupType",
      cond: "=",
      value: "S"
    }]
  } as APISearchProps,
  POHeader: {
    Table: "OPOR",
    Fields: ["DocNum"],
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
  } as APISearchProps
}