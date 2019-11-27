var async = require("async");
var bankNiftyToday = require("./tasks/banknifty-today");
var consolePrinter = require("./tasks/console-printer");
var nseHistory = require("./tasks/nse-history");
var nseHistoryEnrichDates = require("./tasks/nse-history-enrich-dates");
var saveJson = require("./tasks/save-json");
var start = next => next(null, {}); //initialize function

var tasks = [
  start,
  bankNiftyToday,
  nseHistory,
  nseHistoryEnrichDates,
  //consolePrinter,
  saveJson
];

async.waterfall(tasks, (err, result) => {});
