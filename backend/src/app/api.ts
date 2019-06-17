import config from "../config";
const fetch = require("node-fetch");

export const query = async (
  query: string,
  headers: { [key: string]: string } = {},
  opt: { [key: string]: string } = {}
): Promise<{ [key: string]: any }> => {
  // console.log(query);
  const response: Response = await fetch(config.url, {
    method: "POST",
    body: JSON.stringify({
      ...opt,
      query
    }),
    headers: {
      ...headers,
      "Content-Type": "application/json",
      "x-hasura-admin-secret": config.secret
    }
  });
  const json = await response.json();
  const result = {
    ...json.data
  };
  return result;
};
