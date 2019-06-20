declare const __DEV__: boolean;

export const DEBUG = __DEV__;
export const DEV = __DEV__;

export const MainStyle: any = {
  backgroundColor: "#f4f6fa",
  color: "#7E66B0",
  fieldTextColor: "#404040",
  fieldColor: "#a7a7a7",
  primaryColor: "#1d6ef7",
  secondaryColor: "#FA2E69",
  errorColor: "#dc3545",
  successColor: "#28a745",
  warningColor: "#ffc107",
  iconBackButton: require('@icon/arrow_back.png'),
  iconMenuButton: require('@icon/menu.png'),
  backgroundSidebar: '#fff'
};

export default {
  url: "https://hasura.publicfigure.site/v1/graphql",
  wsurl: "wss://hasura.publicfigure.site/v1/graphql",
  hasura_admin_secret: "figure1234"
};
