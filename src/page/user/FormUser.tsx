import UIBody from '@app/libs/ui/UIBody';
import UIContainer from '@app/libs/ui/UIContainer';
import UIHeader from '@app/libs/ui/UIHeader';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router';
import UIJsonField from '@app/libs/ui/UIJsonField';
import query from '@app/libs/gql/data/query';
import UISelectField from '@app/libs/ui/UISelectField';
import SAPDropdown from '@app/components/SAPDropdown';
import UIButton from '@app/libs/ui/UIButton';
import IconSave from '@app/libs/ui/Icons/IconSave';
import { isSize } from '@app/libs/ui/MediaQuery';
import UIText from '@app/libs/ui/UIText';
import updateRecord from '@app/libs/gql/data/updateRecord';
import createRecord from '@app/libs/gql/data/createRecord';
import { hashPassword } from '@app/libs/gql/session/hashPassword';
import global from '@app/global';

export default withRouter(observer(({ match, showSidebar, sidebar }: any) => {
    const [data, setData] = useState({});
    console.log(global.session);
    useEffect(() => {
        const get = async () => {
            await query("user", [
                'area',
                'bpgroup',
                'branch',
                'cash_account',
                'fullname',
                'id',
                'warehouse_id',
                'username',
                'transfer_account',
                // 'sap_id',
                'sales_as_customer',
                'role',
                'password'
            ], { where: { id: match.params.id } }).then(res => {
                res['password'] = '';
                setData(res);
            });
        };
        if (!!match.params.id) get();
    }, []);
    return (
        <UIContainer>
            <UIHeader showSidebar={showSidebar} sidebar={sidebar} center="Form User">
                <UIButton
                    color="primary"
                    size="small"
                    onPress={async () => {
                        let record: any = { ...data };
                        if (!record.password) delete record.password;
                        if (!!record.id)
                            await updateRecord("user", record).then(() => alert("Saved!"));
                        else {
                            record.id = await createRecord("user", record).then(() => alert("Saved!"));
                        } 
                        
                        if (!!record.password) hashPassword(record.id);
                    }}
                >
                    <IconSave color="#fff" />
                    {isSize(["md", "lg"]) && (
                        <UIText style={{ color: "#fff" }}>{" Save"}</UIText>
                    )}
                </UIButton>
            </UIHeader>
            <UIBody>
                <UIJsonField
                    items={data}
                    field={[
                        {
                            key: "general",
                            label: "General",
                            sublabel: "Informasi User",
                            value: [
                                { key: "fullname", label: "Full Name", size: 12 },
                                {
                                    key: "area", size: 8, label: "Area", component: (
                                        <SAPDropdown label="Area" field="Area" value={(data as any).area} setValue={(v) => { setData({ ...data, area: v }) }} />)
                                },
                                {
                                    key: "bpgroup", size: 6, label: "BP Group", component: (
                                        <SAPDropdown label="BP Group" field="BPGroup" value={(data as any).bpgroup} setValue={(v) => { setData({ ...data, bpgroup: v }) }} />)
                                },
                                {
                                    key: "branch", size: 6, label: "Branch", component: (
                                        <SAPDropdown label="Branch" field="Branch" value={(data as any).branch} setValue={(v) => { setData({ ...data, branch: v }) }} />)
                                },
                                {
                                    key: "cash_account", size: 12, label: "Cash Account", component: (
                                        <SAPDropdown label="Cash Account" field="ChartOfAccount" value={(data as any).cash_account} setValue={(v) => { setData({ ...data, cash_account: v }) }} />)
                                },
                                {
                                    key: "warehouse_id", size: 12, label: "Warehouse Code", component: (
                                        <SAPDropdown label="Warehouse Code" field="Custom" customQuery={{ 
                                            Table: "OWHS", 
                                            Fields: ["WhsCode"],
                                            Page:1 
                                        }} value={(data as any).warehouse_id} setValue={(v) => { setData({ ...data, warehouse_id: v }) }} />)
                                },
                                // { key: "sap_id", size: 4, label: "SAP Code" },
                                {
                                    key: "sales_as_customer", size: 12, label: "Sales As Customer", component: (
                                        <SAPDropdown label="Sales As Customer" field="SalesAsEmployee" value={(data as any).sales_as_customer} setValue={(v) => { setData({ ...data, sales_as_customer: v }) }} />)
                                }
                            ]
                        },
                        {
                            key: "account",
                            label: "Account",
                            sublabel: "User Account",
                            value: [
                                { key: "role", label: "Role", size: 12, component: (<UISelectField label="Role" items={[{ label: 'Admin', value: 'admin' }, { label: 'Sales Canvasing', value: 'sales_canvas' }, { label: 'Sales Taking Order', value: 'sales_to' }]} value={(data as any).role} setValue={(v) => { setData({ ...data, role: v }) }} />) },
                                { key: "username", size: 10, label: "Username" },
                                { key: "password", size: 10, label: "Password" },
                            ]
                        }
                    ]}
                    setValue={(value: any, key: any) => {
                        (data as any)[key] = value;
                    }}
                />
            </UIBody>
        </UIContainer>
    );
}))