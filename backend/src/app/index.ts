import koa = require("koa");
import { Context } from "koa";
import { query } from "./api";
import config from "../config";

const bcrypt = require("bcrypt");
const get = require("lodash.get");
const cors = require("@koa/cors");
const app = new koa();

app.use(cors());
app.use(async (ctx: Context) => {
  const changeUserId = getHeader(ctx, "X-Hasura-ChangePass-Uid");
  const sessionId = getHeader(ctx, "X-Hasura-Session-Id");
  const clientId = getHeader(ctx, "X-Hasura-Cid");
  const username = getHeader(ctx, "X-Hasura-Username");
  const password = getHeader(ctx, "X-Hasura-Password");

  let unhandled = true;
  ctx.res.statusCode = 200;
  ctx.res.setHeader("content-type", "application/json");

  if (!!changeUserId) {
    const user = await getUserById(changeUserId);
    if (
      user &&
      user[config.identifier.password] &&
      user[config.identifier.password].length < 30
    ) {
      unhandled = false;
      await hashPassword(changeUserId, user[config.identifier.password]);
      send(ctx, 200, {
        "X-Hasura-Role": "anonymous",
        "X-Hasura-Status": "success"
      });
    }
  } else if (!!sessionId) {
    const user = await getUserBySessionId(sessionId);
    const logoutid = getHeader(ctx, "X-Hasura-Logout-Id");
    if (logoutid) {
      if (logoutid.split("-")[1] == user[config.identifier.id].toString()) {
        await logoutSession(sessionId);
      }
    } else {
      unhandled = false;
      if (!!user) {
        send(ctx, 200, {
          "X-Hasura-User-Id": user[config.identifier.id].toString(),
          "X-Hasura-Cid": config.identifier.client_id
            ? user[config.identifier.client_id].toString()
            : "",
          "X-Hasura-Role":
            config.identifier.role[0] === "'"
              ? config.identifier.role.substr(
                  1,
                  config.identifier.role.length - 2
                )
              : user[config.identifier.role],
          "X-Hasura-BPGroup": user.bpgroup,
          "X-Hasura-Warehouse-Id": user.warehouse_id,
          "X-Hasura-Session-Id": sessionId,
          "X-Hasura-Branch": user.branch,
          "X-Hasura-Area": user.area,
          "X-Hasura-SalesAsCust": user.sales_as_customer,
          "X-Hasura-Cash-Account": user.cash_account,
          "X-Hasura-Transfer-Account": user.transfer_account,
          "X-Hasaru-SlpCode": user.slp_id
        });
      } else {
        send(ctx, 300, {
          "X-Hasura-Role": "anonymous",
          "X-Hasura-Reason": "Session not found"
        });
      }
    }
  } else if (!!username && !!password) {
    const user = await getUserByUsername(clientId, username);
    if (user) {
      unhandled = false;
      let res = await bcrypt.compare(password, user.password);
      if (res) {
        await deleteOldSession(user.id);
        const session = await addSession(user.id);
        send(ctx, 200, {
          "X-Hasura-User-Id": user[config.identifier.id].toString(),
          "X-Hasura-Cid": config.identifier.client_id
            ? user[config.identifier.client_id].toString()
            : "",
          "X-Hasura-Role":
            config.identifier.role[0] === "'"
              ? config.identifier.role.substr(
                  1,
                  config.identifier.role.length - 2
                )
              : user[config.identifier.role],
          "X-Hasura-BPGroup": user.bpgroup,
          "X-Hasura-Warehouse-Id": user.warehouse_id,
          "X-Hasura-Session-Id": session.id
        });
      } else {
        send(ctx, 300, {
          "X-Hasura-Role": "anonymous",
          "X-Hasura-Reason": "Wrong password"
        });
      }
    } else {
      send(ctx, 300, {
        "X-Hasura-Role": "anonymous",
        "X-Hasura-Reason": "User not found"
      });
    }
  }

  if (unhandled) {
    send(ctx, 200, {
      "X-Hasura-Role": "anonymous"
    });
  }
});

function getHeader(ctx: any, header: string) {
  if (ctx && ctx.request && ctx.request.headers) {
    if (ctx.request.headers[header]) {
      return ctx.request.headers[header];
    } else {
      return ctx.request.headers[header.toLowerCase()];
    }
  }
  return undefined;
}

function send(ctx: any, statusCode: number, result: object) {
  ctx.res.statusCode = statusCode;
  ctx.res.end(JSON.stringify(result));
}

function format(column: string, value: any) {
  if (config.identifierType[column] === "int") return value;
  else return `"${value}"`;
}

async function getUserById(id: any) {
  let result = await query(`{
    ${config.table}(where: {id: {_eq: ${format("id", id)}}}) {
      ${config.columns.join("\n")}
    }
  }`);
  return get(result, `${config.table}[0]`);
}

async function logoutSession(sid: any) {
  await query(`mutation {
    delete_session(where: {id: {_eq: "${sid}"}})
  }`);
}
async function getUserByUsername(clientId: any, username: any) {
  let cidtext = "";
  if (config.identifier.client_id) {
    cidtext = `, ${config.identifier.client_id}: {
      _eq: ${format("client_id", clientId)}
    }`;
  }

  let result = await query(`{
    ${config.table}(where: {${config.identifier.username}: {
      _eq: ${format("username", username)}
    }${cidtext}}) {
      ${config.columns.join("\n")}
    }
  }`);
  
  return get(result, `${config.table}[0]`);
}

async function getUserBySessionId(sessionId: string) {
  let session = await query(`{ 
    session(
      where: {
        id: {_eq: "${sessionId}"}
      }
    ) {
      ${config.table} {
        ${config.columns.join("\n")}
      }
    }
  }`);

  return get(session, `session[0].${config.table}`);
}

async function hashPassword(userId: any, password: string) {
  let hash = await bcrypt.hash(password, 10);
  return await query(
    `mutation {
      update_${config.table}(
        where: {
          ${config.identifier.id}: {_eq: ${format("id", userId)}}
        },
        _set: {${config.identifier.password}: ${format("password", hash)}}
      ) {
        affected_rows
      }
    }`
  );
}

async function deleteOldSession(userId: any) {
  const maxSession = 3;

  let allSession = await query(`{ 
    session(
      order_by: {tstamp: desc},
      where: {
        ${config.table}_id: {_eq: ${format("id", userId)}}
      }
    ) {
      id
      tstamp
    }
  }`);

  if (allSession.session.length > maxSession) {
    for (let i in allSession.session) {
      if (parseInt(i) >= maxSession) {
        const s = allSession.session[i];
        const q = `mutation {delete_session(where: {id: {_eq: "${
          s.id
        }"}}) {affected_rows}}`;
        await query(q);
      }
    }
  }
}

async function addSession(userId: any) {
  let res = await query(`mutation {
    insert_session(objects: {
      ${config.table}_id: ${format("id", userId)}
    }) {
      returning {
        id
      }
    }
  }`);
  return res.insert_session.returning[0];
}

app.listen(80);
