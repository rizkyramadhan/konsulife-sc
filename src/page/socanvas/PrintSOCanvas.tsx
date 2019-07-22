import React from 'react';
import { View,Text} from 'reactxp';
import _ from 'lodash';

export default ({ data, items }: any) => {
    console.log(items);
    return <View>
        <Text>NOTA PENJUALAN</Text>
        <Text>PT MASABARU GUNA PERSADA</Text>
        <Text>JLN. KRAMAT GANTUNG 148 SURABAYA 60174 - INDONESIA</Text>
        <Text>-----------------------------------------------------------------------------------------------------</Text>
        <Text>No. SO    : {data.U_IDU_SO_INTNUM}</Text>
        <Text>Tanggal   : {data.DocDate}</Text>
        <Text>Termin    : {data.GroupNum}</Text>
        <Text>-----------------------------------------------------------------------------------------------------</Text>
        <Text>  Qty                 Price                           Dis                        Sub Total           </Text>
        <Text>-----------------------------------------------------------------------------------------------------</Text>
        {items.map((val:any) =>{
            return (<View>
            <Text>  {val.Dscription}</Text>
            <Text>  {val.Quantity} {val.unitMsr}                {val.PriceBefDi}                    {val.DiscPrcnt}                     {val.TotalPrice}</Text>
            </View>);
        })}
        <Text>-----------------------------------------------------------------------------------------------------</Text>
        <Text>                                                  Total               {_.sumBy(items, "TotalPrice")}</Text>
        <Text>                                                  Diskon           {data.DiscSum}</Text>
        <Text>                                                  PPN               {data.VatSum}</Text>
        <Text>                                                  Total Net        {data.DocTotal}</Text>
        <Text>-----------------------------------------------------------------------------------------------------</Text>
        <Text>      Sales       </Text>
        <Text>                  </Text>
        <Text>                  </Text>
        <Text>  {data.SlpCode}  </Text>
    </View>
}