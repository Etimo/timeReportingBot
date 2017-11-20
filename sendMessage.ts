import * as request from "request";
import slackUri from "./creds/uri";

export default class SlackMessage {
  private options;

  constructor(name, message) {
    this.options = {
      headers: {
        "content-type": "application/json",
      },
      json: {
        display_name: "The time BOT",
        icon_emoji: ":suspect:",
        text: `${name} ${message}`,
      },
      method: "POST",
      uri: slackUri,
    };

  }

  public sendMessage() {
    request(this.options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
      // console.log(body.id) // Print the shortened url.
      } else {
       return error;
      }
    });
  }

}
