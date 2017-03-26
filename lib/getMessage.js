module.exports = function getMessage(label, expects, actual) {
  return `${label} should be "${expects}", received "${actual}"`
}
