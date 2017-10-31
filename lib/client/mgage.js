var request = require("request");
var qs = require("qs");

function Mgage(url, aid, pid, signature, opts) {
  opts = opts || {};
  var env = opts.env || process.env;

  this.url = url || env.MGAGE_URL;
  this.aid = aid || env.MGAGE_AID;
  this.pid = pid || env.MGAGE_PID;
  this.signature = signature || env.MGAGE_SIGNATURE;

  if (!this.url) {
    throw new Error("url is required");
  }

  if (!this.aid) {
    throw new Error("aid is required");
  }

  if (!this.pid) {
    throw new Error("pid is required");
  }

  if (!this.signature) {
    throw new Error("signature is required");
  }
}

Mgage.prototype.sendSms = function(number, message, fn) {
  if (!number) {
    throw new Error("number is required");
  }

  if (!message) {
    throw new Error("message is required");
  }

  var request = require("request");
  console.log('senfing "' + message + '" to "' + number + '"');
  request(
    this.url +
      "?" +
      qs.stringify({
        aid: this.aid,
        pin: this.pid,
        signature: this.signature,
        mnumber: number,
        message: message
      }),
    function(error, response, body) {
      console.log("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      console.log("body:", body); // Print the HTML for the Google homepage.
      if (error || (response && response.statusCode / 100 != 2)) {
        fn("error while sending message", body);
      } else if(body.startsWith("Message Accepted for Request ID")) {
        fn(null, body);
      } else {
        fn("error while sending message", body);
      }
    }
  );
};

var initializer = function(url, aid, pid, signature, opts) {
  return new Mgage(url, aid, pid, signature, opts);
};

module.exports = exports = initializer;
