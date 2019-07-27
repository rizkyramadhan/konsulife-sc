import { observable } from "mobx";

export const session = observable({
  coba: "test"
});

setTimeout(() => {
  session.coba = "hancur";
}, 3000);
