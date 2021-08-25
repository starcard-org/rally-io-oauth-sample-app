# Rally IO Oauth Sample App


This App is a simple Node.Js server that can

* register to Rally and get refresh and access tokens
* using refresh token, get a new access token
* start an authorization flow

## Endpoints

Please refer to the following [documentation](https://api-docs.rally.io) for more information on the endpoints. 

* GET /register\
This endpoint submits developer credentials to Rally and memorizes 
newly acquired access and refresh tokens.

* GET /refresh \
This endpoint submits the refresh token to Rally and obtain a new
access token.

* GET /authorize.html\
This returns a form to allow the user to initiate the authorization
flow.

* POST /authorize\
This endpoint starts the authorization flow for the user.

* GET /callback\
This endpoint receives an authorization code as query parameter. It
submits this code to Rally and retrieves the info about the
authenticated user.  It then shows the retrieved informat.  The
information currently consists of the user id of the user but it will
be the handle to the user.

* POST /transfer\
This endpoint initiates a transfer.  It uses the access token to authenticate the request to the Rally IO server.  It forwards its body to Rally IO endpoint and returns the Rally IO response.

* GET /top_holders_and_transactions?rnbUserId=&lt;rnbUserId&gt;&symbol=&lt;symbol&gt;&period=&lt;period&gt;\
This endpoint returns top holders and transactions (buy, send, sell) for a specific coin.

* POST /userinfo/&lt;rnbUserId&gt;\
This endpoint returns user information about the user.

* POST /flow_control_limits/&lt;rnbUserId&gt;/&lt;symbol&gt;\
This endpoint returns the flow control limits for a user for a specific coin symbol.

## Run locally

### Setup environment variables

* RALLY_IO_USERNAME\
(mandatory: user name of developer)
* RALLY_IO_PASSWORD\
(mandatory: password of developer)
* RALLY_API_URL\
(base URL for data-api service. 
- If you are a community dev, set it to https://api.rally.io. 
- If you are a Rally core dev, connect your backend or else it defaults to https://localhost:3004)

* SAMPLE_APP_PORT\
(optional: port to which the sample app listens. Defaults to 5555)
* SAMPLE_APP_CALLBACK\
(callback for Rally into the sample app. Defaults to
http://localhost:{port}/callback)

As an example, create an `.env` file at the root level of your project.

Add at least the required varibles to the `.env` file (with quotes).

```
RALLY_IO_USERNAME="yourusername"
RALLY_IO_PASSWORD="yourpassword"
```
Utiize a package or another method to load environment variables such as `.dotenv`. For example, review and download the `.dotenv package`: https://www.npmjs.com/package/dotenv.

### Run command
```bash
npm install
npm run start
```
### Sample commands

* Trigger the Sample App to register into Rally
```bash
curl http://localhost:5555/register
```
* Trigger the Sample App to refresh its token
```bash
curl http://localhost:5555/refresh
```
* Initiate an Authorize Flow
```bash
In browser, type http://localhost:5555/authorize.html
```
