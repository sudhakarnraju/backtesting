const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const os = require('os');
var moment = require('moment');
const request = require('request');
var unzipper = require("unzipper");
var path = require('path');
const filePath = path.join(__dirname, '../files/');
var result = {data: []};
var processCompletionStatus = 0;
var fromDate = moment('01-01-2013','DD-MM-YYYY');
var toDate = moment('03-01-2013','DD-MM-YYYY');
toDate = toDate.add(1, 'days')
var noOfDays = toDate.diff(fromDate, 'days');
var nsePrefix =  'https://www.nseindia.com/archives/combine_report/combined_report';

module.exports = (data, next) => {
  // Examples
  //TODO: Download options data
  function downloadFiles(date, zipFileName, xlFileName){
    var url = nsePrefix+date+'.zip';
    var requestData = request(url);
    requestData.on('response',  function (res) {
      var stream = fs.createWriteStream(filePath+date+'.zip');
      res.pipe(stream);
      stream.on('finish', function () {
        unzipFiles(zipFileName, xlFileName);
      });
    });
  }
  function unzipFiles(fileName, xlFileName){
    try {
      var stream = unzipper.Extract({ path: filePath })
      fs.createReadStream(fileName).pipe(stream);
      stream.on('finish', function () {
        var jsonResult = convertXlToJSON(xlFileName);
        result.data.push(jsonResult.Report1);
        processCompletionCheck();
      });
    } catch (e) {
      console.log("Error"+fileName);
    }
  }
  function processCompletionCheck(){
    processCompletionStatus++;
    if(processCompletionStatus == noOfDays){
      generateFinalResult();
    }
  }
  function generateFinalResult(){
    fs.writeFileSync(filePath+'finalResult.txt', JSON.stringify(result));
  }
  const getDate  = async function (){
    for (var m = moment(fromDate); m.isBefore(toDate); m.add(1, 'days')) {
      var date = m.format('DD-MM-YYYY').replace(/-/g,'');
      var zipFileName = filePath+date+".zip";
      var xlFileName = filePath+"combined_report"+date+".xls";
      downloadFiles(date, zipFileName, xlFileName);
    }
  }
  function convertXlToJSON(filename){
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
  getDate();
  data.optionsToday = result;
  // next(null, data); //Do not send more than one result, though framework allows it
};
