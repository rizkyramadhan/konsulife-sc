import UIButton from "@app/libs/ui/UIButton";
import UIList from "@app/libs/ui/UIList";
import UIRow from "@app/libs/ui/UIRow";
import React from "react";

// const _modalId = "ErrorDialog";
// const showDialog = () => {
//   let dialog = (
//     <View style={{ backgroundColor: "#fff" }}>
//       <UIText>'An error occurred'</UIText>
//       <UIButton
//         onPress={() => {
//           alert("close!");
//         }}
//       >
//         <UIText>'OK'</UIText>
//       </UIButton>
//     </View>
//   );

//   Modal.show(dialog, _modalId);
// };

export default ({ items, setItems }: any) => {
  return (
    <UIList
      // headers={[
      //   {
      //     key: "ItemCode",
      //     label: "Item Code"
      //   },
      //   {
      //     key: "Dscription",
      //     label: "Item Description"
      //   },
      //   // {
      //   //   key: "U_IDU_PARTNUM",
      //   //   label: "Part Number"
      //   // },
      //   {
      //     key: "UseBaseUn",
      //     label: "Invt. UoM"
      //   },
      //   {
      //     key: "Quantity",
      //     label: "QTY"
      //   },
      //   {
      //     key: "UoMCode",
      //     label: "UOM Code"
      //   },
      //   // {
      //   //   key: "WhsCode",
      //   //   label: "Warehouse Code"
      //   // },
      //   // {
      //   //   key: "ShipDate",
      //   //   label: "Row Delivery Date"
      //   // },
      //   // {
      //   //   key: "OcrCode",
      //   //   label: "Distribution Rule"
      //   // },
      //   // {
      //   //   key: "OcrCode2",
      //   //   label: "Distribution Rule2"
      //   // },
      //   {
      //     key: "PriceBefDi",
      //     label: "Unit Price"
      //   },
      //   {
      //     key: "DiscPrcnt",
      //     label: "Disc. %"
      //   },
      //   {
      //     key: "TaxCode",
      //     label: "Tax Code"
      //   },
      //   {
      //     key: "action",
      //     label: ""
      //   }
      // ]}

      // colWidth={[
      //   {
      //     index: 4,
      //     width: 90
      //   }
      // ]}
      items={items.map((item: any, index: any) => ({
        ...item,
        UnitPrice: item.UnitPrice.toLocaleString(),
        // DiscPrcnt: (
        //   <UITextField
        //     type="number"
        //     value={item.DiscPrcnt}
        //     setValue={e => (item.DiscPrcnt = e)}
        //   />
        // ),
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
    />
  );
};
