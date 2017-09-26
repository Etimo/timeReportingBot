import * as request from "request"; // new way to get modules from node modules. npm install --save-dev @types/request

export default class SlackMessage {
  private options;

  constructor(name, message) {
    this.options = {
      headers: {
        "content-type": "application/json",
      },
      json: {
        icon_emoji: ":suspect:",
        text: `${name} ${message}`,
        username: "BOten",
      },
      method: "POST",
      uri: "***REMOVED***",
    };

  }

  public sendMessage() {
    request(this.options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
      // console.log(body.id) // Print the shortened url.
      }else {
       // console.log(error);
      }
    });
  }

}
