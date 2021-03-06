declare const __DEV__: boolean;

export const DEBUG = __DEV__;
export const DEV = __DEV__;

export const MainStyle: any = {
  textColor: "#4d5b6a",
  backgroundColor: "#f0f4f7",
  color: "#128CDE",
  fieldTextColor: "#404040",
  fieldColor: "#a7a7a7",
  primaryColor: "#128CDE",
  secondaryColor: "#FA2E69",
  errorColor: "#dc3545",
  successColor: "#28a745",
  warningColor: "#ffc107",
  backgroundSidebar: "#fff",
  pattern: require("@app/assets/images/pattern.png")
};

export default {
  url: "https://hasura.publicfigure.site/v1/graphql",
  wsurl: "wss://hasura.publicfigure.site/v1/graphql",
  hasura_admin_secret: "figure1234",
  // wsSAP: "http://172.16.145.3:8087/MBGPService/Api/"
  wsSAP: "http://116.254.101.121:5000/MBGPWebService/Api/",
  wsBackend: "http://116.254.101.121:1000/"
  //wsBackend:"http://localhost:44343/",
};
