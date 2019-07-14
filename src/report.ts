import Axios from "axios";
import config from "./config";
import { lpad } from "./utils/Helper";

export const ReportPost = (type: string, data: any) => {
  return new Promise((resolve, reject) => {
    Axios.post(config.wsBackend + "api/" + type, JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then((res: any) => {
        if (typeof res.data == "object" && !!res.data && !!res.data.ErrorCode) {
          reject(res.data);
        }
        resolve(res.data);
        Axios({
          url: config.wsBackend + res.data,
          method: "GET",
          responseType: "blob" // important
        }).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;

          const date = new Date();
          const dateval =
            date.getFullYear() +
            lpad((date.getMonth() + 1).toString(), "0", 2) +
            lpad(date.getDate().toString(), "0", 2) +
            lpad(date.getHours().toString(), "0", 2) +
            lpad(date.getMinutes().toString(), "0", 2) +
            lpad(date.getSeconds().toString(), "0", 2);

          link.setAttribute("download", type + "_" + dateval + ".pdf");
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch((err: any) => {
        console.error(err);
        reject(err);
      });
  });
};
