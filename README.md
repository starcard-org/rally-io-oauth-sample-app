# Rally IO Oauth Sample App

## Run locally

### Setup environment variables

* RALLY_IO_USERNAME
(mandatory: user name of developer)
* RALLY_IO_PASSWORD
(mandatory: password of developer)
* RALLY_API_URL
(optional: base URL for data-api service. Defaults to http://localhost:3000)
* SAMPLE_APP_PORT
(optional: port to which the sample app listens. Defaults to 5555)
* SAMPLE_APP_CALLBACK
(callback for Rally into the sample app. Defaults to
http://localhost:{port}/callback)


### Run command
```bash
node sample-app.js
```

### Start the data-api service
Start the data-api service as indicated in the data-api documentation
or make sure env variables point to a running data-api service.

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
