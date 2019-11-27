var API = require("indian-stock-exchange");

var NSEAPI = API.NSE;

module.exports = (data, next) => {
  // Examples
  //TODO: Download options data
  console.log("TODO: Download options data");
  data.optionsToday = {};
  next(null, data); //Do not send more than one result, though framework allows it
};
