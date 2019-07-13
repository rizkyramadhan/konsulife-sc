import Axios from 'axios';
import config from './config';
import {saveAs} from 'file-saver';

export const ReportPost = (type:string,data: any) => {
    return new Promise((reject) => {
      Axios.post(config.wsBackend + "api/" + type, JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            responseType : 'arraybuffer',
          }
        }).then((response) => {
          let blob = new Blob([response.data], {type: "application/pdf;charset=utf-8"});
          saveAs(blob,"tes.pdf");
        }).catch((error) => {
          console.log(error);
        });
    });
  };