var fs = require("fs");
/**
 * Print output to console
 * @param {*} data
 * @param {*} next
 */
module.exports = (data, next) => {
  console.log("writing file");
  fs.writeFile("bankNiftyHistory.json", JSON.stringify(data), "utf8", () => {
    next(null, data);
  });
};
