/**
 * Print output to console
 * @param {*} data
 * @param {*} next
 */
module.exports = (data, next) => {
  console.log(JSON.stringify(data));
  next(null, data);
};
