var API = require("indian-stock-exchange");

var NSEAPI = API.NSE;

module.exports = (data, next) => {
  // Examples
  NSEAPI.getIndices().then(function({ data: { data: indexData } }) {
    var result = indexData;
    if (result) {
      result = result.find(id => id.indexName === "NIFTY BANK");
    }
    //data.bankNiftyToday = result;
    next(null, data); //Do not send more than one result, though framework allows it
  });
};
