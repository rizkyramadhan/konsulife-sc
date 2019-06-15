declare const __DEV__: boolean;

export const DEBUG = __DEV__;
export const DEV = __DEV__;

export const MainStyle: any = {
  color: "#7E66B0",
  fieldColor: "#333333",
  primaryColor: "#613EEA",
  secondaryColor: "#FA2E69",
  errorColor: "#dc3545",
  successColor: "#28a745",
  warningColor: "#ffc107",

};

export default {
  url: "https://hasura.publicfigure.site/v1/graphql",
  wsurl: "wss://hasura.publicfigure.site/v1/graphql",
  hasura_admin_secret: "figure1234"
};
