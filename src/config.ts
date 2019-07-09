declare const __DEV__: boolean;

export const DEBUG = __DEV__;
export const DEV = __DEV__;

export const MainStyle: any = {
  backgroundColor: "#f4f6fa",
  color: "#1d6ef7",
  fieldTextColor: "#404040",
  fieldColor: "#a7a7a7",
  primaryColor: "#1d6ef7",
  secondaryColor: "#FA2E69",
  errorColor: "#dc3545",
  successColor: "#28a745",
  warningColor: "#ffc107",
  backgroundSidebar: '#fff'
};

export default {
  url: "https://hasura.publicfigure.site/v1/graphql",
  wsurl: "wss://hasura.publicfigure.site/v1/graphql",
  hasura_admin_secret: "figure1234",
  // wsSAP: "http://172.16.145.3:8087/MBGPService/Api/"
  wsSAP: "http://116.254.101.121:5000/MBGPWebService/Api/",
  wsBackend:"http://116.254.101.121:1000/",
};
