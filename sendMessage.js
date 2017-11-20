"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const uri_1 = require("./creds/uri");
class SlackMessage {
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
            uri: uri_1.default,
        };
    }
    sendMessage() {
        request(this.options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                // console.log(body.id) // Print the shortened url.
            }
            else {
                return error;
            }
        });
    }
}
exports.default = SlackMessage;
//# sourceMappingURL=sendMessage.js.map