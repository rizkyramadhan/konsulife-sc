import Axios from 'axios';
import config from './config';

export const ReportPost = (type:string,data: any) => {
    return new Promise((resolve, reject) => {
      Axios.post(config.wsBackend +  + type, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }).then((res: any) => {
          if (typeof res.data == "object" && !!res.data && !!res.data.ErrorCode) {
            reject(res.data);
          }
          console.log(res);
          resolve(res.data);
          window.open(config.wsBackend + res.data);
        })
        .catch((err: any) => {
          console.error(err);
          reject(err);
        });
    });
  };