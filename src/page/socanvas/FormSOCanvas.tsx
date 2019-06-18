import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonField from "@app/libs/ui/UIJsonField";
import UIJsonTable from "@app/libs/ui/UIJsonTable";
import UIRow from "@app/libs/ui/UIRow";
import UITextField from "@app/libs/ui/UITextField";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

const sample = {
  CardCode: "TIM0002",
  CardName: "PT FREEPOT INDONESIA",
  DocStatus: "Open",
  U_IDU_SO_INTNUM: "SO/TIM-0002/19/VI/0001",
  Sales: "Dwi",
  GrandTotal: 1000000
};

const sampleList = [
  {
    ItemCode: "BSLSR000001",
    Dscription: "750R16-8PR-TL L310-T",
    UnitPrice: 1950000,
    DiscPrcnt: ""
  },
  {
    ItemCode: "BSLSR000001",
    Dscription: "750R16-8PR-TL L310-T",
    UnitPrice: 1950000,
    DiscPrcnt: ""
  }
];

export default observer(({ showSidebar, sidebar }: any) => {
  const data = sample;
  const [items, setItems] = useState(sampleList);

  return (
    <UIContainer>
      <UIHeader
        showSidebar={showSidebar}
        sidebar={sidebar}
        center="Form Sales Order"
      >
        <UIButton
          color="primary"
          size="small"
          onPress={() => {
            alert("Saved!");
          }}
          style={{
            height: 40,
            marginRight: 28,
            paddingLeft: 20,
            paddingRight: 20,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end"
          }}
        >
          Save
        </UIButton>
      </UIHeader>
      <UIBody>
        <UIJsonField
          items={data}
          field={[
            {
              key: "general",
              label: "General",
              sublabel: "Informasi Sales Order",
              value: [
                {
                  key: "U_IDU_SO_INTNUM",
                  type: "field",
                  label: "SO Number"
                },
                { key: "DocStatus", size: 3, label: "Status" },

                { key: "Sales", size: 8, label: "Sales" },
                { type: "empty", size: 2 },
                { key: "PostingDate", size: 4, label: "Posting Date" },
                { key: "DeliveryDate", size: 4, label: "Delivery Date" },
                { key: "DocumentDate", size: 4, label: "Document Date" }
              ]
            },
            {
              key: "customer",
              label: "Customer",
              sublabel: "Toko Penerima Barang",
              value: [
                { key: "CardCode", label: "Customer" },
                { key: "CardName", label: "Name" },
                { key: "ContactPerson", label: "Contact Person" },
                { key: "POCustomerNo", label: "PO Customer No" }
              ]
            },
            {
              key: "summary",
              label: "Summary",
              value: [{ key: "GrandTotal", type: "money" }]
            }
          ]}
          setValue={(value: any, key: any) => {
            (data as any)[key] = value;
          }}
        />

        <UIJsonTable
          headers={[
            {
              key: "ItemCode",
              label: "Item Code"
            },
            {
              key: "Dscription",
              label: "Item Description"
            },
            {
              key: "UnitPrice",
              label: "Unit Price"
            },
            {
              key: "DiscPrcnt",
              label: "Discount"
            },
            {
              key: "action",
              label: ""
            }
          ]}
          data={items.map((item, index) => ({
            ...item,
            UnitPrice: item.UnitPrice.toLocaleString(),
            DiscPrcnt: (
              <UITextField
                type="number"
                value={item.DiscPrcnt}

                setValue={e => (item.DiscPrcnt = e)}
              />
            ),
            action: (
              <UIRow>
                <UIButton
                  size="small"
                  color="error"
                  onPress={() => {
                    items.splice(index, 1);
                    setItems([...items]);
                  }}
                  fill="clear"
                >
                  Remove
                    </UIButton>
              </UIRow>
            )
          }))}
          colWidth={[
            {
              index: 4,
              width: 90
            }
          ]}
        />
      </UIBody>
    </UIContainer>
  );
});
