import { types } from "mobx-state-tree";

const SessionUser = types.model({
  bpgroup: types.string,
  id: types.number,
  password: types.string,
  role: types.string,
  username: types.string,
  warehouse_id: types.string
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
    session: Session
  })
  .views(self => ({
    getSession() {
      return self.session;
    }
  }))
  .actions(self => ({
    setSession(s: any) {
      if (s) self.session = s;
    },
    removeSession() {
      self.session = {
        cid: "",
        role: "",
        sid: "",
        uid: "",
        user: {
          bpgroup: "",
          id: 0,
          password: "",
          role: "",
          username: "",
          warehouse_id: ""
        }
      };
    }
  }));

// create an instance from a snapshot
export default Store.create({
  session: {
    cid: "",
    role: "",
    sid: "",
    uid: "",
    user: {
      bpgroup: "",
      id: 0,
      password: "",
      role: "",
      username: "",
      warehouse_id: ""
    }
  }
});
