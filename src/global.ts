import { types } from "mobx-state-tree";

const SessionUser = types.model({
  fullname: types.string,
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
  slp_id: types.maybeNull(types.string)
});

const Session = types.model({
  cid: types.string,
  role: types.string,
  sid: types.string,
  uid: types.string,
  user: SessionUser
});

const Booking = types.model({
  date: types.string,
  time: types.string,
  psikolog: types.string
});

const Store = types
  .model({
    session: Session,
    sidebar: types.boolean,
    booking: Booking
  })
  .views(self => ({
    getSession() {
      return self.session;
    },
    getBooking() {
      return self.booking;
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
    setBooking(s: any) {
      self.booking = s;
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
    fullname: "",
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
    slp_id: ""
  }
};

const DefaultBooking = {
  date: "",
  time: "",
  psikolog: ""
};

// create an instance from a snapshot
export default Store.create({
  session: DefaultSession,
  sidebar: false,
  booking: DefaultBooking
});
