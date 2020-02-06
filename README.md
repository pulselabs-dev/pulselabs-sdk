# [Pulselabs Recorder](https://www.pulselabs.ai) - Analytics for your alexa skill & Google Action

SDK to record & replay voice interactions for tests conducted on pulse labs platform

## Setup

Create a free account at [https://www.pulselabs.ai](https://www.pulselabs.ai) and get an API_KEY.

pulselabs-recorder is available via NPM.

```bash
npm install pulselabs-recorder --save
```

Follow the instructions at [https://dashboard.pulselabs.ai/client/documentation](https://dashboard.pulselabs.ai/client/documentation)

## Configuration Options
Additional configuration options are available when importing the pulselabs-recorder module. The configuration options are passed through via a config object in the init call. 

```javascript
const configuration = {
  'debug': true,
  'timeout': 1000,
}

const pulse = require('pulselabs-recorder').init('yourApiKeyHere', configuration)
```

The following are the available configuration keys:

***debug*** - ```boolean``` logs helpful debugging information  
***timeout*** - ```number``` timeouts requests after given milliseconds
