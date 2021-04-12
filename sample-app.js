'use strict';

const axios = require('axios').default;
const Hapi = require('@hapi/hapi');
const Path = require('path');
let port = process.env.SAMPLE_APP_PORT;
port = port && parseInt(port) || 5555;
const rally_api_url = (process.env.RALLY_API_URL || "http://localhost:3000") + "/v1";
const username = process.env.RALLY_IO_USERNAME;
const password = process.env.RALLY_IO_PASSWORD;
const callback_url = process.env.SAMPLE_APP_CALLBACK || `http://localhost:${port}/callback`;
const callback_path = new URL(callback_url).pathname;

function toConfig(headers) {
  return headers && Object.keys(headers).length ? { headers } : undefined;
}

async function httpPost(url, body, headers) {
  try {
    return await axios.post(url, body, toConfig(headers));
  } catch (err) {
    return err.response;
  }
}

async function httpGet(url, headers) {
  try {
    return await axios.get(url, toConfig(headers));
  } catch (err) {
    return err.response;
  }
}

let access_token = undefined;
let refresh_token = undefined;
let expires = undefined;
let token_type = undefined;

function set_authentication(data) {
  if (data) {
    access_token = data.access_token;
    expires = (data.expires_in || 3600) * 1000 + Date.now();
    refresh_token = data.refresh_token || refresh_token;
    token_type = data.token_type;
  } else {
    access_token = undefined;
    expires = undefined;
    refresh_token = undefined;
    token_type = undefined;
  }
}

async function start() {

  const server = Hapi.server({
    port: port,
    host: '0.0.0.0',
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'static')
      }
    }
  });

  await server.register(require('@hapi/inert'));

  server.route({
    method: 'GET',
    path: '/register',
    handler: async (request, h) => {
      console.log("/register");
      console.log("Trying to register to Rally");
      const response = await httpPost(rally_api_url + "/oauth/register", {username, password});
      const status = response.status;
      console.log(`status = ${status}`);
      if (status == 200) {
        const data = response.data;
        console.log(`data = ${JSON.stringify(data,undefined,2)}`);
        set_authentication(data);
        return h.response("Succesfully registered to Rally").code(200);
      } else {
        console.log('Registration failed: clearing authentication data');
        set_authentication();
        return h.response(response.statusText).code(status);
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/refresh',
    handler: async (request, h) => {
      console.log("/refresh");
      console.log("Trying to refresh tokens with Rally");
      if (!refresh_token) {
        return h.response("Application Not Registered With Rally").code(401);
      }
      const response = await httpPost(rally_api_url + "/oauth/refresh", { refresh_token});
      const status = response.status;
      console.log(`status = ${status}`);
      if (status == 200) {
        const data = response.data;
        console.log(`data = ${JSON.stringify(data,undefined,2)}`);
        set_authentication(data);
        return h.response("Succesfully refreshed token").code(200);
      } else {
        console.log('Registration failed: clearing authentication data');
        set_authentication();
        return h.response(response.statusText).code(status);
      }

    }
  });

  server.route({
    method: 'GET',
    path: '/authorize.html',
    handler: function (request, h) {
      console.log('authorize.html');
      return h.file('authorize.html');
    }
  });

  server.route({
    method: 'POST',
    path: "/authorize",
    handler: async function(request, h) {
      console.log("/authorize");
      if (!access_token) {
        return h.response("Application Not Registered With Rally").code(401);
      }
      console.log("Calling Rally IO authorize API");
      const rally_response = await httpPost(
        rally_api_url + "/oauth/authorize",
        { callback: callback_url },
        { Authorization: "Bearer " + access_token }
      );

      console.log(`rally_response = ${JSON.stringify(rally_response.data)}`);
      const status = rally_response.status;
      if (status == 200) {
        console.log(`redirecting to ${rally_response.data.url}`);
        return h.redirect(rally_response.data.url);
      } else {
        return h.response(rally_response.statusText).code(status);
      }
    }
  });

  server.route({
    method: 'GET',
    path: callback_path,
    handler: async function(request, h) {
      console.log(callback_path);
      if (!access_token) {
        return h.response("Application Not Registered With Rally").code(401);
      }
      console.log(`params = ${JSON.stringify(request.query)}`);
      const code = request.query.code;
      console.log(`code = ${code}`);
      if (code === "cancelled") {
        return h.response("No authorization to continue").code(200);
      }
      const rally_response = await httpPost(
        rally_api_url + "/oauth/userinfo",
        { code },
        { Authorization: "Bearer " + access_token }
      );
      const status = rally_response.status;
      if (status == 200) {
        return h.response(rally_response.data).code(200);
      } else {
        return h.response(rally_response.statusText).code(status);
      }
    }
  });

  server.route({
    method: 'POST',
    path: "/transfer",
    handler: async function(request, h) {
      console.log("/transfer");
      if (!access_token) {
        return h.response("Application Not Registered With Rally").code(401);
      }
      console.log("Calling Rally IO transfer API");
      const rally_response = await httpPost(
        rally_api_url + "/transactions/transfer/initiate",
        //{ fromRnbUserId, toRnbUserId, coinKind, amount, inputType, note, showNote, showUserName },
        request.payload,
        { Authorization: "Bearer " + access_token }
      );

      console.log(`rally_response = ${JSON.stringify(rally_response.data)}`);
      return h.response(rally_response.data).code(rally_response.status);
    }
  });

  server.route({
    method: 'GET',
    path: '/creators/top_holders_and_transactions',
    handler: async function(request, h) {
      if (!access_token) {
        return h.response("Application Not Registered With Rally").code(401);
      }
      console.log(`params = ${JSON.stringify(request.query)}`);
      console.log('token: ' + access_token);

      const rnbUserId = request.query.rnbUserId;
      const symbol = request.query.symbol;
      const timePeriod = request.query.timePeriod;

      console.log('Calling GET /creators/top_holders_and_transactions');
      const rally_response = await httpGet(
        rally_api_url + `/creators/top_holders_and_transactions?rnbUserId=${rnbUserId}&symbol=${symbol}&timePeriod=${timePeriod}`,
        { Authorization: "Bearer " + access_token },
      );
      console.log(`rally_response = ${JSON.stringify(rally_response.data)}`);

      const status = rally_response.status;
      if (status == 200) {
        return h.response(rally_response.data).code(200);
      } else {
        return h.response(rally_response.statusText).code(status);
      }
    }
  });

  await server.start();

  console.log('Server running at:', server.info.uri);
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});


start();
