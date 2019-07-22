import {  APISearchProps, APISearch } from "@app/api";
import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UITabs from "@app/libs/ui/UITabs";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { View } from "reactxp";
import UIField from "@app/libs/ui/UIField";
import ViewSOCanvasDetail from './ViewSOCanvasDetail';
import { decodeSAPDateToFormal } from '@app/utils/Helper';
import PrintSOCanvas from './PrintSOCanvas';
import BtnExport from '@app/components/BtnExport';



export default withRouter(
  observer(({ match, showSidebar, sidebar }: any) => {
    const [data, setData] = useState<any>({});
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [print, setPrint] = useState(false);

    useEffect(() => {
        setLoading(true);
        const docEntry = match.params.id;
  
        // SELECT FIRST SO
        let query: APISearchProps = {
          Table: "ORDR",
          Fields: [
            "CardCode",
            "CardName",
            "NumAtCard",
            "DocDate",
            "DocDueDate",
            "DocCur",
            "DocRate",
            "U_IDU_SO_INTNUM",
            "GroupNum",
            "SlpCode",
            "CntctCode",
            "Address2",
            "Address",
            "Comments",
            "DocTotal",
            "VatSum",
            "DiscSum",
            "DiscPrcnt",
            "U_BRANCH",
            "U_USERID",
            "U_GENERATED",
            "U_WONUM"
          ],
          Condition: [
            {
              field: "DocEntry",
              cond: "=",
              value: docEntry
            }
          ]
        };
  
        APISearch(query).then((res: any) => {
            res[0].DiscPrcnt = parseFloat(res[0].DiscPrcnt).toFixed(2);
            res[0].DiscSum = parseFloat(res[0].DiscSum).toFixed(2);
            res[0].VatSum = parseFloat(res[0].VatSum).toFixed(2);
            res[0].DocTotal = parseFloat(res[0].DocTotal).toFixed(2);
            res[0].DocDate = decodeSAPDateToFormal(res[0].DocDate);
            res[0].DocDueDate = decodeSAPDateToFormal(res[0].DocDueDate);
            const data = res[0];
            setData({...data});

            query = {
                Table: "OCTG",
                Fields: ["GroupNum", "PymntGroup"],
                Condition: [
                  {
                    field: "GroupNum",
                    cond: "=",
                    value: data.GroupNum
                  }
                ]
              };
      
              APISearch(query).then((pay: any) => {
                query = {
                    Table: "OSLP",
                    Fields: ["SlpCode", "SlpName"],
                    Condition: [
                      {
                        field: "SlpCode",
                        cond: "=",
                        value:  res[0]["SlpCode"]
                      }
                    ]
                };
          
                APISearch(query).then((sel: any) => {
                    query = {
                        Table: "OCPR",
                        Fields: ["CntctCode", "Name"],
                        Condition: [
                        {
                            field: "CntctCode",
                            cond: "=",
                            value: res[0]["CntctCode"]
                        }]
                    };
                    APISearch(query).then((con: any) => {
                        setData({ ...data, GroupNum: pay[0]["PymntGroup"] ,SlpCode: sel[0]["SlpName"], CntctCode:con[0]["Name"]});
                    });
                });
              });

        });
  
        // SELECT LIST SO OPEN
        query = {
          Table: "RDR1",
          Fields: [
            "DocEntry",
            "LineNum",
            "ObjType",
            "ItemCode",
            "Dscription",
            "U_IDU_PARTNUM",
            "UseBaseUn",
            "Quantity",
            "UomEntry",
            "UomCode",
            "unitMsr",
            "WhsCode",
            "ShipDate",
            "OcrCode",
            "OcrCode2",
            "PriceBefDi",
            "DiscPrcnt",
            "TaxCode",
            "OpenQty"
          ],
          Condition: [
            {
              field: "DocEntry",
              cond: "=",
              value: docEntry
            },
            {
              cond: "AND"
            },
            {
              field: "LineStatus",
              cond: "=",
              value: "O"
            }
          ]
        };
  
        APISearch(query).then((res: any) => {
          const items = res.map((item: any) => {
            item.Key = btoa(item.DocEntry + "|" + item.LineNum);
            
            item.Quantity = parseInt(item.OpenQty);
            item.PriceBefDi = parseFloat(item.PriceBefDi).toFixed(2);
            item.DiscPrcnt = parseFloat(item.OpenQty).toFixed(2);
            
            let price:number = parseFloat(item.PriceBefDi) * parseFloat(item.OpenQty);         
            let disc:number = price * parseFloat(item.DiscPrcnt) /100;

            item.TotalPrice = (price - disc).toFixed(2);

            return item;
          });
          setItems([...items]);
          setLoading(false);
        });
      }, []);

    return (
      <UIContainer>
        <UIHeader
            showSidebar={showSidebar}
            sidebar={sidebar}
            center="View SO Canvasing"
            isLoading={loading}
          >
          <BtnExport
            exporting={exporting}
            onPress={() => {
              setPrint(true);
              setExporting(true);
            }}
          />
        </UIHeader>
        {print && <PrintSOCanvas data={data} items={items} />}
        {!print &&
          <UIBody scroll={true}>
            <UIJsonField
              items={data}
              field={[
                {
                  key: "customer",
                  label: "Customer",
                  sublabel: "Toko Penerima Barang",
                  value: [
                    {
                      key: "CardCode",
                      size: 12,
                      type: "field",
                      label: "Customer Code"
                    },
                    {
                      key: "CardName",
                      label: "Customer Name",
                      size: 12,
                      type: "field",
                    },
                    {
                      key: "CntctCode",
                      label: "Contact Person",
                      size: 12,
                      type: "field",
                    },
                    { key: "NumAtCard", label: "Customer Ref No.", size: 12, type:"field" }
                  ]
                },
                {
                  key: "payment",
                  label: "Payment",
                  sublabel: "Informasi Pembayaran",
                  value: [
                    {
                      key: "Address2",
                      label: "Ship To",
                      size: 12,
                      type:"field"
                    },
                    {
                      key: "Address",
                      label: "Bill To",
                      size: 12,
                      type:"field"
                    },
                    {
                      key: "GroupNum",
                      label: "Payment Term",
                      size: 12,
                      type:"field"
                    }
                  ]
                },
                {
                  key: "general",
                  label: "General",
                  sublabel: "Informasi Sales Order",
                  value: [
                    {
                      key: "U_IDU_SO_INTNUM",
                      label: "SO No.",
                      size:12,
                      type:"field"
                    },
                    {
                      key: "SlpCode",
                      label: "Sales Name",
                      size: 12,
                      type:"field"
                    },
                    {
                      key: "U_WONUM",
                      size: 12,
                      label:"WO No.",
                      type:"field"
                    },
                    {
                      key: "DocDate",
                      size: 6,
                      type: "field",
                      label: "Posting Date"
                    },
                    {
                      key: "DocDueDate",
                      size: 6,
                      type: "field",
                      label: "Delivery Date"
                    }
                  ]
                },
              ]}
              setValue={(value: any, key: any) => {
                (data as any)[key] = value;
                setData({ ...data });
              }}
            />

            <View style={{ marginTop: 50 }}>
              <UITabs
                tabs={[
                  {
                    label: "Detail Items",
                    content: () => (
                      <ViewSOCanvasDetail
                        items={items}
                      />
                    )
                  }
                ]}
              />
            </View>
            <UIJsonField
              items={data}
              style={{
                paddingTop: 20,
                paddingBottom: 100,
                borderWidth: 0,
                borderTopWidth: 1,
                borderColor: "#ccc"
              }}
              field={[
                { type: "empty", size: 6 },
                {
                  key: "summary",
                  label: "Summary",
                  size: 6,
                  value: [
                    {
                      key: "TotalPrice",
                      label: "Total",
                      size: 12,
                      component: (
                        <UIField
                          label="Total"
                          fieldStyle={{ backgroundColor: "#ececeb" }}
                        >
                          {_.sumBy(items, "TotalPrice")}
                        </UIField>
                      )
                    },
                    {
                      key: "DiscPrcnt",
                      size: 4,
                      label: "Disc (%)",
                      type: "field"
                    },
                    {
                      key: "DiscSum",
                      size: 8,
                      label: "Disc",
                      type: "field"
                    },
                    {
                      key: "VatSum",
                      size: 12,
                      label: "PPN (10%)",
                      type: "field"
                    },
                    {
                      key: "DocTotal",
                      size: 12,
                      label: "Total After Tax",
                      type: "field"
                    }
                  ]
                }
              ]}
              setValue={(value: any, key: any) => {
                (data as any)[key] = value;
                setData({ ...data });
              }}
            />
          </UIBody>
        }
      </UIContainer>
    );
  })
);
