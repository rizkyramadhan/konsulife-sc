import UIList from "@app/libs/ui/UIList";
import React from "react";

export default ({ items }: any) => {
    return (
        <UIList
            selection="multi"
            onSelect={(item, items) => { console.log(item, items) }}
            primaryKey="LineNum"
            items={items}
            fields={{
                ItemCode: {
                    table: {
                        header: "Code"
                    }
                },
                Dscription: {
                    table: {
                        header: "Item Name"
                    }
                },
                U_IDU_PARTNUM: {
                    table: {
                        header: "Part Number"
                    }
                },
                WhsCode: {
                    table: {
                        header: "Warehouse"
                    }
                },
                Quantity: {
                    table: {
                        header: "Quantity"
                    }
                },
                UomCode: {
                    table: {
                        header: "UoM Code"
                    }
                },
                OpenCreQty: {
                    table: {
                        header: "Open Qty"
                    }
                },
            }}
        />
    );
};
