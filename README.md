# Rally IO Oauth Sample App


This App is a simple Node.Js server that can

* register to Rally and get refresh and access tokens
* using refresh token, get a new access token
* start an authorization flow

## Endpoints

* GET /register\
This endpoint submits developer credentials to Rally and memorizes 
newly acquired access and refresh tokens

* GET /refresh \
This endpoint submits the refresh token to Rally and obtain a new
access token.

* GET /authorize.html\
This returns a form to allow the user to initiate the authorization
flow

* POST /authorize\
This endpoint starts the authorization flow for the user

* GET /callback\
This endpoint receives an authorization code as query parameter. It
submits this code to Rally and retrieves the info about the
authenticated user.  It then shows the retrieved informat.  The
information currently consists of the user id of the user but it will
be the handle to the user.

* POST /transfer\
This endpoint initiates a transfer.  It uses the access token to authenticate the request to the Rally IO server.  It forwards its body to Rally IO endpoint and returns the Rally IO response.

## Run locally

### Setup environment variables

* RALLY_IO_USERNAME\
(mandatory: user name of developer)
* RALLY_IO_PASSWORD\
(mandatory: password of developer)
* RALLY_API_URL\
(optional: base URL for data-api service. Defaults to http://localhost:3000)
* SAMPLE_APP_PORT\
(optional: port to which the sample app listens. Defaults to 5555)
* SAMPLE_APP_CALLBACK\
(callback for Rally into the sample app. Defaults to
http://localhost:{port}/callback)


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
