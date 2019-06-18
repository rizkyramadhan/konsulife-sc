declare const __DEV__: boolean;

export const DEBUG = __DEV__;
export const DEV = __DEV__;

export const MainStyle: any = {
  backgroundColor: "#f3f3f3",
  color: "#7E66B0",
  fieldTextColor: "#404040",
  fieldColor: "#333",
  primaryColor: "#613EEA",
  secondaryColor: "#FA2E69",
  errorColor: "#dc3545",
  successColor: "#28a745",
  warningColor: "#ffc107",
  iconBackButton: require('@app/images/arrow_back.png'),
  iconMenuButton: require('@app/images/menu.png'),
  iconPath: '@app/images/'
};

export default {
  url: "https://hasura.publicfigure.site/v1/graphql",
  wsurl: "wss://hasura.publicfigure.site/v1/graphql",
  hasura_admin_secret: "figure1234"
};
