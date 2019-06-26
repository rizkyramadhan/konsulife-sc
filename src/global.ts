import { types } from "mobx-state-tree";

const SessionUser = types.model({
  bpgroup: types.string,
  id: types.number,
  password: types.string,
  role: types.string,
  username: types.string,
  warehouse_id: types.string,
  sap_id: types.maybeNull(types.string),
  area: types.maybeNull(types.string),
  branch: types.maybeNull(types.string),
  sales_as_customer: types.maybeNull(types.string),
  cash_account: types.maybeNull(types.string),
  transfer_account: types.maybeNull(types.string),
  slp_code: types.maybeNull(types.string)
});

const Session = types.model({
  cid: types.string,
  role: types.string,
  sid: types.string,
  uid: types.string,
  user: SessionUser
});

const Store = types
  .model({
    session: Session,
    sidebar: types.boolean
  })
  .views(self => ({
    getSession() {
      return self.session;
    }
  }))
  .actions(self => ({
    setSession(s: any) {
      const n = {
        ...DefaultSession,
        ...s,
        loaded: true
      };

      if (s && s.user) {
        n.user = {
          ...DefaultSession.user,
          ...s.user
        };
      }

      self.session = n;
    },
    removeSession() {
      self.session = DefaultSession;
    },
    setSidebar(s: boolean) {
      self.sidebar = s;
    }
  }));

const DefaultSession = {
  cid: "",
  role: "",
  sid: "",
  uid: "",
  user: {
    bpgroup: "",
    id: 0,
    password: "",
    sap_id: "",
    role: "",
    username: "",
    warehouse_id: "",
    area: "",
    branch: "",
    sales_as_customer: "",
    cash_account: "",
    transfer_account: "",
    slp_code: ""
  }
};

// create an instance from a snapshot
export default Store.create({
  session: DefaultSession,
  sidebar: false
});
