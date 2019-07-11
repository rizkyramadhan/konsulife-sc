import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UITabs from "@app/libs/ui/UITabs";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { View } from "reactxp";
import FormInvStockDetails from "./FormInvStockDetails";
import { decodeSAPDateToFormal } from '@app/utils/Helper';
import { APISearchProps, APISearch } from '@app/api';

export default withRouter(
  observer(({ match, showSidebar, sidebar }: any) => {
    const [data, setData] = useState<any>({});
    const [items, setItems] = useState<any[]>([]);
    useEffect(() => {
        let query: APISearchProps = {
          Table: "OWTR",
          Fields: [
            "DocDate",
            "DocDueDate",
            "DocNum",
            "DocEntry",
            "CardName",
            "CardCode",
            "Address",
            "Filler",
            "ToWhsCode",
            "Comments",
            "SlpCode",
            "U_BRANCH",
            "U_USERID",
            "U_GENERATED",
            "U_IDU_ITR_INTNUM",
            "U_IDU_IT_INTNUM",
            "U_IDU_CONTNUM",
            "U_IDU_NOSEAL",
            "U_IDU_NOPL",
            "U_IDU_NOPOL",
            "U_IDU_DRIVER",
            "U_WONUM",
            "U_STOCK_RETURN",
            "U_STOCK_TRANSNO"
          ],
          Condition: [
            {
              field: "DocEntry",
              cond: "=",
              value: match.params.id
            }
          ]
        };
  
        APISearch(query).then((res: any) => {
          const data = res[0];
          res[0]["DocDate"] = decodeSAPDateToFormal(res[0]["DocDate"]);
          res[0]["DocDueDate"] = decodeSAPDateToFormal(res[0]["DocDueDate"]); 
  
          setData(data);
  
          query = {
              Table: "OPRC",
              Fields: ["PrcCode", "PrcName"],
              Condition: [
                {
                  field: "PrcCode",
                  cond: "=",
                  value: data.U_BRANCH
                }
              ]
            };
      
            APISearch(query).then((res: any) => {
                  setData({...data, City:res[0]["PrcName"]});
            });
        });
  
        query = {
          Table: "WTR1",
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
          ],
          Condition: [
            {
              field: "DocEntry",
              cond: "=",
              value: match.params.id
            }
          ]
        };
  
        APISearch(query).then((res: any) => {
          const items = res.map((item: any) => {
            item.Key = btoa(item.DocEntry + "|" + item.LineNum);
  
            return item;
          });
          setItems([...items]);
        });
      }, []);

    return (
      <UIContainer>
        <UIHeader
          isBack={true}
          showSidebar={showSidebar}
          sidebar={sidebar}
          center="Stock Return View"
        >
        </UIHeader>
        <UIBody scroll={true}>
          <UIJsonField
            items={data}
            field={[
              {
                key: "vendor",
                label: "Business Partner",
                value: [
                  {
                    key: "CardCode",
                    size: 12,
                    type: "field",
                    label: "Vendor Code"
                  },
                  {
                    key: "CardName",
                    label: "Vendor Name",
                    size: 12,
                    type: "field"
                  },
                  {
                    key: "Address",
                    label: "Ship To",
                    size: 12,
                    type: "field"
                  }
                ]
              },
              {
                key: "general",
                label: "General",
                value: [
                {
                    key: "U_IDU_IT_INTNUM",
                    size: 12,
                    label: "IT Number",
                    type: "field"
                },
                {
                    key: "U_WONUM",
                    size: 12,
                    label: "WO Number",
                    type: "field"
                },
                {
                    key: "DocDate",
                    size: 6,
                    type: "field",
                    label: "Posting Date",
                },
                {
                    key: "DocDueDate",
                    size: 6,
                    type: "field",
                    label: "Delivery Date",
                },
                {
                    key: "Filler",
                    size: 6,
                    type: "field",
                    label: "From Warehouse",
                },
                {
                    key: "ToWhsCode",
                    size: 6,
                    type: "field",
                    label: "To Warehouse",
                }]
              },
              {
                key: "info",
                label: "Shipment",
                value: [
                  { key: "U_IDU_CONTNUM", size: 6, label: "No. Container", type:"field" },
                  { key: "U_IDU_NOSEAL", size: 6, label: "No. Seal", type:"field" },
                  { key: "U_IDU_NOPL", size: 6, label: "No. PL", type:"field" },
                  { key: "U_IDU_NOPOL", size: 6, label: "Nopol", type:"field" },
                  { key: "U_IDU_DRIVER", size: 12, label: "Driver", type:"field" }
                ]
              }
            ]}
            setValue={(value: any, key: any) => {
              (data as any)[key] = value;
              setData(data);
            }}
          />

          <View style={{ marginTop: 50 }}>
            <UITabs
              tabs={[
                {
                  label: "Detail items",
                  content: () => (
                    <FormInvStockDetails
                      items={items}
                    />
                  )
                }
              ]}
            />
          </View>
        </UIBody>
      </UIContainer>
    );
  })
);