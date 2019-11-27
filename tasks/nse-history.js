var nseHistoricalData = require("nse-historical-data");
let options = {
  date: {
    start: "2019-01-01",
    end: "2019-11-22"
  }
};
/**
 *     {
      "Index Name": "Nifty Bank",
      "Index Date": "12-01-2018",
      "Open Index Value": "25732.4",
      "High Index Value": "25775.15",
      "Low Index Value": "25557.6",
      "Closing Index Value": "25749.05",
      "Points Change": "88.15",
      "Change(%)": ".34",
      "Volume": "110836433",
      "Turnover (Rs. Cr.)": "2926.84",
      "P/E": "29.69",
      "P/B": "2.99",
      "Div Yield": ".18",
      "date": "2018-01-12"
    },
 */
module.exports = (data, next) => {
  console.log("nse-history begins");
  nseHistoricalData
    .default(options)
    .then(function(result) {
      let bankNiftyHistory = [];
      Object.keys(result).forEach(date => {
        let bankNifty = result[date].find(
          index => index["Index Name"] === "Nifty Bank"
        );
        if (bankNifty) bankNifty.date = date;
        bankNiftyHistory.push(bankNifty);
      });
      data.bankNiftyHistory = bankNiftyHistory;
      next(null, data);
    })
    .catch(function(err) {
      next(err, data);
    });
};
