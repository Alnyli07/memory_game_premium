const Http = require("sf-core/net/http");

var http = new Http();

const SERVER_URL = "https://demo-alitugrul.c9users.io";

function httpHelper(options, callback) {
    http.request({
        url: options.url,
        headers: options.headers,
        method: options.method,
        body: options.body,
        onLoad: function(response) {
            //console.log("RESPONSE" + response.body.toString());
            callback(null, response.body.toString());
        },
        onError: function(e) {
            // Handle error like:
            callback(e);
            if (e.statusCode === 500) {
                console.log("Internal Server Error Occurred.");
            }
            else {
                console.log("Server responsed with: " + e.statusCode + ". Message is: " + e.message);
            }
        }
    });
}


module.exports.reqNewLeader = (user, score, callback) => {
    httpHelper({
        url: SERVER_URL + "/leader",
        body: JSON.stringify({ user, score }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
    }, callback);
};

module.exports.reqGetLeader = (callback) => {
    httpHelper({
        url: SERVER_URL + "/leader",
        method: "GET"
    }, callback);
};
