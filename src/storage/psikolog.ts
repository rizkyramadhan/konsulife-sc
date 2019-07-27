import { observable } from "mobx";
import day from "dayjs";
export const psikolog = observable({
  jadwal: [
    {
      id: 1,
      name: "Irul Arif",
      package: "voice",
      datetime: day().toISOString()
    },
    {
      id: 2,
      name: "Rizky Ramadhan",
      package: "voice",
      datetime: day()
        .add(1, "day")
        .toISOString()
    }
  ]
});
