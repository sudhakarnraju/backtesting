var async = require("async");
var bankNiftyToday = require("./tasks/banknifty-today");
var consolePrinter = require("./tasks/console-printer");
var nseHistory = require("./tasks/nse-history");
var nseHistoryEnrichDates = require("./tasks/nse-history-enrich-dates");
var saveJson = require("./tasks/save-json");
var options = require("./tasks/option-todays-data");

var start = next => next(null, {}); //initialize function

var bankNiftyHistoryTasks = [
  start,
  bankNiftyToday,
  nseHistory,
  nseHistoryEnrichDates,
  //consolePrinter,
  saveJson
];

var optionTasks = [start, options, consolePrinter, saveJson];

async.waterfall(optionTasks, (err, result) => {});
