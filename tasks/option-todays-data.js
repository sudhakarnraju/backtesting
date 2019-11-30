const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const os = require('os');
var moment = require('moment');
const request = require('request');
var unzipper = require("unzipper");
var path = require('path');
const filePath = path.join(__dirname, '../files/');
var result = {data: []};

module.exports = (data, next) => {
  // Examples
  //TODO: Download options data
  const downloadFiles = async function(date){
    var url = 'https://www.nseindia.com/archives/combine_report/combined_report'+date+'.zip';
    var requestData = request(url);
    requestData.on('response',  function (res) {
      console.log("Date--------"+date);
      res.pipe(fs.createWriteStream(filePath+date+'.zip'));
    });
  }
  const unzipFiles = async function(fileName){
    try {
      fs.createReadStream(fileName).pipe(unzipper.Extract({ path: filePath }));
    } catch (e) {
      console.log("No such file"+fileName);
    }
  }
  const convertXlToJSON = async function(filename){
    try {
      const result = excelToJson({
        header:{
            rows: 1
        },
        columnToKey: {
            A: 'BhavcopyDate',
            B: 'Segment',
            C: 'ISIN code',
            D: 'Instrument Type',
            E: 'Symbol',
            F: 'Series',
            G: 'Reverse Leg Date',
            H: 'Security Name',
            I: 'Security Status',
            J: 'Face Value',
            K: 'Lot Size',
            L: 'Expiry Date',
            M: 'Strike Price',
            N: 'Option Type',
            O: 'Previous Close Price',
            P: 'Open Price',
            Q: 'High Price',
            R: 'Low Price',
            S: 'Closing Price',
            T: 'Last Traded Price',
            U: 'Settlement Price',
            V: 'Number of Trades',
            W: 'Qty / Contracts Traded',
            X: 'Value (In Lacs)',
            Y: 'Open Interest',
            Z: 'Change in Open Interest',
            AA: '52 Week High Price',
            AB:	'52 Week High Price Date',
            AC:	'52 Week Low Price',
            AD:	'52 Week Low Price Date',
            AE:	'Corporate Action Indicator',
            AF:	'Record Date',
            AG:	'Book Closure Start Date',
            AH:	'Book Closure End Date',
            AI:	'No delivery start date',
            AJ:	'No delivery end date',
            AK:	'Ex Date',
            AL:	'Corporate action remarks',
            AM:	'Interest payment date',
            AN:	'Maturity Date',
            AO:	'Annualised Yield',
            AP:	'Transaction Value (in lacs)',
            AQ:	'Bloomberg Code'
        },
        source: fs.readFileSync(filename) // fs.readFileSync return a Buffer
      });
      return result;
    } catch (e) {
      console.log("Error " + e);
    }
  }
  const getDate  = async function (){
    var fromDate = moment('01-01-2013','DD-MM-YYYY');
    var toDate = moment('03-01-2013','DD-MM-YYYY');
    for (var m = moment(fromDate); m.isBefore(toDate); m.add(1, 'days')) {
      var date = m.format('DD-MM-YYYY').replace(/-/g,'');
      var zipFileName = filePath+date+".zip";
      var xlFileName = filePath+"combined_report"+date+".xls";
      await downloadFiles(date); //TODO: sync not working
      await unzipFiles(zipFileName); //TODO: sync not working
      var completeResult = await convertXlToJSON(xlFileName); //TODO: sync not working
      console.log("Result :" + JSON.stringify(completeResult.Report1[0]));
      result.data.push(completeResult.Report1);
    }
    fs.writeFileSync(filePath+'filename.txt', JSON.stringify(result));
  }
  getDate();
  console.log("TODO: Download options data");
  data.optionsToday = result;
  next(null, data); //Do not send more than one result, though framework allows it
};
