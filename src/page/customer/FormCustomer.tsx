import { APIPost, APISearch, APISearchProps } from "@app/api";
import BtnSave from '@app/components/BtnSave';
import SAPDropdown from "@app/components/SAPDropdown";
import global from '@app/global';
import IconAdd from "@app/libs/ui/Icons/IconAdd";
import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UITabs from "@app/libs/ui/UITabs";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { withRouter } from "@app/libs/router/Routing";
import { View } from "reactxp";
import FormCustomerBillToItems from "./FormCustomerBillToItems";
import FormCustomerCPItems from "./FormCustomerCPItems";
import FormCustomerShipToItems from "./FormCustomerShipToItems";

const customer = {
  Series: "",
  CardName: "",
  CardType: "L",
  GroupCode: "",
  LicTradNum: "",
  AddID: "",
  SlpCode: "-1",
  Phone1: "",
  Phone2: "",
  Fax: "",
  Cellular: "",
  E_Mail: "",
  GroupNum: "-1",
  U_IDU_AREA: "",
  U_IDU_BRANCH: "",
  U_LATITUDE: "",
  U_LONGITUDE: "",
  U_SALES: "N",
  U_USERID: "",
  U_GENERATED: "W",
  SeriesName: ""
};

export default withRouter(
  observer(({ history, match, showSidebar, sidebar }: any) => {
    const [data, setData] = useState(customer);
    const [itemCP, setItemCP] = useState<any[]>([]);
    const [itemBillTo, setItemBillTo] = useState<any[]>([]);
    const [itemShipTo, setItemShipTo] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);

    const ActionCP = () => {
      return (
        <UIButton
          style={{
            flexShrink: 0,
            marginRight: 0
          }}
          color="success"
          size="small"
          onPress={() => {
            setItemCP([
              ...(itemCP as any),
              {
                Key: new Date().valueOf(),
                Name: "",
                FirstName: "",
                MiddleName: "",
                LastName: "",
                Tel1: "",
                Tel2: "",
                Cellolar: ""
              }
            ]);
          }}
        >
          <IconAdd
            color="#fff"
            height={18}
            width={18}
          />
          {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#fff" }} size="small">
              {" Add Row"}
            </UIText>
          )}
        </UIButton>
      );
    };

    const ActionShip = () => {
      return (
        <UIButton
          style={{
            flexShrink: 0,
            marginRight: 0
          }}
          color="success"
          size="small"
          onPress={() => {
            setItemShipTo([
              ...itemShipTo,
              {
                Key: new Date().valueOf(),
                Address: "",
                Street: "",
                ZipCode: "",
                City: "",
                State: "",
                AdresType: "S",
                IsDefault: itemShipTo.length === 0 ? "Y" : "N"
              }
            ]);
          }}
        >
          <IconAdd
            color="#fff"
            height={18}
            width={18}
          />
          {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#fff" }} size="small">
              {" Add Row"}
            </UIText>
          )}
        </UIButton>
      );
    };

    const ActionBill = () => {
      return (
        <UIButton
          style={{
            flexShrink: 0,
            marginRight: 0
          }}
          color="success"
          size="small"
          onPress={() => {
            setItemBillTo([
              ...itemBillTo,
              {
                Key: new Date().valueOf(),
                Address: "",
                Street: "",
                ZipCode: "",
                City: "",
                State: "",
                AdresType: "B",
                IsDefault: itemBillTo.length === 0 ? "Y" : "N"
              }
            ]);
          }}
        >
          <IconAdd
            color="#fff"
            height={18}
            width={18}
          />
          {isSize(["md", "lg"]) && (
            <UIText style={{ color: "#fff" }} size="small">
              {" Add Row"}
            </UIText>
          )}
        </UIButton>
      );
    };

    const save = async () => {
      if (saving) return;
      if (!data.CardName || data.CardName === "" || !data.AddID || data.AddID === "") return alert("Field Nama dan KTP wajib diisi");

      setSaving(true);
      const Lines_CP = itemCP.map(d => {
        delete d.Key;
        return d;
      });

      const Lines_BT = itemBillTo.map(d => {
        delete d.Key;
        return d;
      });

      const Lines_ST = itemShipTo.map(d => {
        delete d.Key;
        return d;
      });

      (data as any).U_IDU_AREA = global.session.user.area;
      (data as any).U_IDU_BRANCH = global.session.user.branch;
      data.U_USERID = global.session.user.username;

      const SeriesName = data.SeriesName;
      delete data.SeriesName;

      try {
        await APIPost("Customer", {
          ...data,
          Lines_CP: [...Lines_CP],
          Lines_Address: [...Lines_BT, ...Lines_ST]
        });
        history.push("/customer")
      } catch (e) {
        alert(e.Message);
        console.error({
          ...data,
          Lines_CP: [...Lines_CP],
          Lines_Address: [...Lines_BT, ...Lines_ST]
        });
      } finally {
        data.SeriesName = SeriesName;
        setSaving(false);
      }
    };

    useEffect(() => {
      APISearch({
        Table: "NNM1",
        Condition: [{
          field: "SeriesName",
          cond: "=",
          value: global.getSession().user.branch
        }],
        Page: 1,
        Limit: 1
      }).then((res: any) => setData({ ...data, Series: res[0].Series, SeriesName: res[0].SeriesName }));


      const get = () => {
        let query: APISearchProps = {
          Table: "OCRD",
          Condition: [
            {
              field: "CardCode",
              cond: "=",
              value: match.params.id
            }
          ]
        };
        APISearch(query).then((res: any) => setData({ ...res[0] }));

        // let query2: APISearchProps = {
        //   Table: "OCPR",
        //   Condition: [{
        //     field: "CardCode",
        //     cond: "=",
        //     value: match.params.id
        //   }]
        // }
        // APISearch(query2).then((res: any) => setItemCP(res));
      };
      if (!!match.params.id) get();
    }, []);

    return (
      <UIContainer>
        <UIHeader
          isBack={true}
          showSidebar={showSidebar}
          sidebar={sidebar}
          center="Form Master Customer"
        >
          <BtnSave saving={saving} onPress={() => {
            save();
          }} />
        </UIHeader>
        <UIBody scroll={true}>
          <UIJsonField
            items={data}
            field={[
              {
                key: "info",
                label: "Customer",
                sublabel: "Informasi Customer",
                value: [
                  { key: "LicTradNum", size: 12, label: "NPWP" },
                  { key: "AddID", size: 12, label: "No KTP" },
                  { key: "Phone1", size: 6, label: "Telephone 1" },
                  { key: "Phone2", size: 6, label: "Telephone 2" },
                  { key: "Fax", size: 6, label: "Fax Number" },
                  { key: "Cellular", size: 6, label: "Mobile Phone" },
                  { key: "E_Mail", size: 12, label: "E-Mail" },
                ]
              },
              {
                key: "general",
                label: "General",
                value: [
                  { key: "CardName", size: 12, label: "BP Name" },
                  {
                    key: "GroupCode",
                    size: 6,
                    component: (
                      <SAPDropdown
                        label="Group Code"
                        field="BPGroup"
                        value={(data as any).GroupCode}
                        setValue={v => {
                          setData({ ...data, GroupCode: v });
                        }}
                      />
                    )
                  },
                  {
                    key: "GroupNum",
                    size: 6,
                    component: (
                      <SAPDropdown
                        label="Payment Terms Code"
                        field="PaymentTerms"
                        value={(data as any).GroupNum}
                        setValue={v => {
                          setData({ ...data, GroupNum: v });
                        }}
                      />
                    )
                  },
                  {
                    key: "SeriesName",
                    size: 6,
                    label: "Series",
                    type: "field"
                    // component: (
                    //   <SAPDropdown
                    //     label="Series"
                    //     field="Series"
                    //     value={(data as any).Series}
                    //     setValue={v => {
                    //       setData({ ...data, Series: v });
                    //     }}
                    //   />
                    // )
                  },
                ]
              }
            ]}
            setValue={(value: any, key: any) => {
              (data as any)[key] = value;
              setData({ ...data });
            }}
          />

          <View style={{ marginTop: 50, minHeight: 900 }}>
            <UITabs
              tabs={[
                {
                  label: "Contact Person",
                  content: () => (
                    <FormCustomerCPItems items={itemCP} setItems={setItemCP} />
                  ),
                  action: ActionCP()
                },
                {
                  label: "Bill To",
                  content: () => (
                    <FormCustomerBillToItems
                      items={itemBillTo}
                      setItems={setItemBillTo}
                    />
                  ),
                  action: ActionBill()
                },
                {
                  label: "Ship To",
                  content: (
                    <FormCustomerShipToItems
                      items={itemShipTo}
                      setItems={setItemShipTo}
                    />
                  ),
                  action: ActionShip()
                }
              ]}
            />
          </View>
        </UIBody>
      </UIContainer>
    );
  })
);
