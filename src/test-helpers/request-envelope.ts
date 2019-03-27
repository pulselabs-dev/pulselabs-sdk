export const requestObject = {
  "version": "1.0",
  "session": {
    "new": false,
    "sessionId": "session1234",
    "attributes": {},
    "user": {
      "userId": "usr123"
    },
    "application": {
      "applicationId": "amzn1.echo-sdk-ams.app.5acba9b5-6d09-4444-aaa8-618c56eb0335"
    }
  },
  "context": {
    "system": {
      "device": {
        "deviceId": "randomId",
        "supportedInterfaces": {
          "AudioPlayer": {}
        }
      },
      "application": {
        "applicationId": "amzn1.echo-sdk-ams.app.5acba9b5-6d09-4444-aaa8-618c56eb0335"
      },
      "user": {
        "userId": "usr123"
      }
    }
  },
  "request": {
    "intent": {
      "slots": {
        "FirstName": {
          "name": "FirstName",
          "value": "John"
        }
      },
      "name": "RandomIntent"
    },
    "type": "IntentRequest",
    "requestId": "request5678"
  }
};

export const responseObject = {
  "body": {
    "version": "1.0",
    "response": {
      "outputSpeech": {
        "type": "SSML",
        "ssml": "<speak>Hello John. Hope you are doing well today.</speak>"
      },
      "type": "_DEFAULT_RESPONSE"
    },
    "sessionAttributes": {},
    "userAgent": "ask-node/2.4.0 Node/v8.10.0"
  }
};