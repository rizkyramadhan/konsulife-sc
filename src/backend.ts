export default {
  url: "https://masabaru.rx.plansys.co/v1/graphql",
  wsurl: "wss://masabaru.rx.plansys.co/v1/graphql",
  appurl: "https://masabaru-app.rx.plansys.co",
  table: "user",
  identifierType: {
    client_id: "",
    id: "int",
    password: "string",
    username: "string"
  },
  identifier: {
    client_id: "",
    id: "id",
    username: "username",
    password: "password",
    role: "role"
  },
  columns: ["id", "username", "password", "role", "warehouse_id", "bpgroup"]
};
