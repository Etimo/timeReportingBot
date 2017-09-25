"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request"); // new way to get modules from node modules. npm install --save-dev @types/request
class SlackMessage {
    constructor(name, message) {
        this.options = {
            headers: {
                "content-type": "application/json",
            },
            json: {
                icon_emoji: ":suspect:",
                text: name + message,
                username: "BOten",
            },
            method: "POST",
            uri: "***REMOVED***",
        };
    }
    sendMessage() {
        request(this.options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                // console.log(body.id) // Print the shortened url.
            }
            else {
                // console.log(error);
            }
        });
    }
}
exports.default = SlackMessage;
//# sourceMappingURL=sendMessage.js.map