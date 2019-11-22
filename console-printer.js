/**
 * Print output to console
 * @param {*} data
 * @param {*} next
 */
module.exports = (data, next) => {
  console.log(data);
  next(null, data);
};
