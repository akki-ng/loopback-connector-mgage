var assert = require("assert");
const debug = require("debug")("loopback:connector:mgage");
var mgage;

module.exports = MgageConnector;

/**
 * Create an instance of the connector with the given `settings`.
 */

function MgageConnector(settings) {
  assert(
    typeof settings === "object",
    "cannot initialize MgageConnector without a settings object"
  );
  var connector = this;

  var url = (this.url = settings.url);
  var aid = (this.aid = settings.aid);
  var pid = (this.pid = settings.pid);
  var signature = (this.signature = settings.signature);

  mgage = connector.mgage = require("./client/mgage")(url, aid, pid, signature);
}

MgageConnector.initialize = function(dataSource, callback) {
  debug("Initializing Mgage connector");
  dataSource.connector = new MgageConnector(dataSource.settings);
  callback();
};

MgageConnector.prototype.DataAccessObject = Mgage;

function Mgage() {}

/**
 * Send a Twillio message or call with the given `options`.
 */

Mgage.sendSms = function(number, message, fn) {
  var dataSource = this.dataSource;
  var settings = dataSource && dataSource.settings;
  var connector = dataSource.connector;
  assert(connector, "Cannot use this module without a connector!");

  connector.mgage.sendSms(number, message, function(err, message) {
    fn(err, message);
  });
};

/**
 * Initialize the connector for the given data source
 * @param {DataSource} dataSource The data source instance
 * @param {Function} [callback] The callback function
 */
exports.initialize = function initializeDataSource(dataSource, callback) {
  console.log("Hi");
};

/**
 * Send using `modelInstance.send()`.
 */

Mgage.prototype.sendSms = function(fn) {
  this.constructor.sendSms(this, fn);
};

/**
 * Access the mgage client object.
 */

MgageConnector.client;
MgageConnector.prototype.client = Mgage.client = Mgage.prototype.client = mgage;
