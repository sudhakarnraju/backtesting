var async = require("async");
var bankNiftyToday = require("./banknifty-today");
var consolePrinter = require("./console-printer");

var start = next => next(null, {}); //initialize function

var tasks = [start, bankNiftyToday, consolePrinter];

async.waterfall(tasks, (err, result) => {});
