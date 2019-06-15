export default {
  url: "https://masabaru.rx.plansys.co/v1/graphql",
  wsurl: "wss://masabaru.rx.plansys.co/v1/graphql",
  appurl: "http://localhost:80",
  secret: "masabaru123",
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
    role: "'sales'"
  },
  columns: ["id", "username", "password", "role"]
};
