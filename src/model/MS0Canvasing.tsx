import { types } from "mobx-state-tree";

const Header = types.model({
  CardCode: types.string,
  CardName: types.string,
  NumAtCard: types.string,
  DocDate: types.string,
  DocDueDate: types.string,
  DocCur: types.string,
  DocRate: types.string,
  U_IDU_SO_INTNUM: types.string,
  GroupNum: types.string,
  SlpCode: types.string,
  CntctCode: types.string,
  Address2: types.string,
  Address: types.string,
  Comments: types.string
});

const Detail = types.model({
  ItemCode: types.string,
  Dscription: types.string,
  U_IDU_PARTNUM: types.string,
  UseBaseUn: types.string,
  Quantity: types.string,
  UoMCode: types.string,
  WhsCode: types.string,
  ShipDate: types.string,
  OcrCode: types.string,
  OcrCode2: types.string,
  UnitPrice: types.string,
  DiscPrcnt: types.string,
  TaxCode: types.string
});

const Model = types
  .model({
    data: types.maybeNull(Header),
    items: types.array(Detail)
  })
  .views(self => ({
    getData() {
      return self.data;
    },
    getItems() {
      return self.items;
    }
  }))
  .actions(self => ({
    setData(key: string, v: string) {
      (self.data as any)[key] = v;
    },
    setItems(i: number, v: any) {
      self.items[i] = v;
    }
  }));

// create an instance from a snapshot
export default Model.create({
  data: null,
  items: []
});
