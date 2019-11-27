var moment = require("moment");
module.exports = (data, next) => {
  var refDate = moment("2010-01-01");
  data.bankNiftyHistory.forEach(historyItem => {
    var tradeDate = moment(historyItem["date"]);
    var daysSince = tradeDate.diff(refDate, "days");
    historyItem.daysSince2010 = daysSince;
    historyItem.week = Math.floor(daysSince / 7);
    historyItem.dayOfWeek = (daysSince % 7) + 1;
    historyItem.isWeekExpiryDay = historyItem.dayOfWeek === 7;
  });
  return next(null, data);
};
