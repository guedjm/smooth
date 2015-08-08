
function parseUri(uri) {
  var paramObj = {};
  var linesParam = uri.split('&');
  linesParam.forEach(function (v, i, a) {
    var splitedLine = v.split('=');
    paramObj[splitedLine[0]] = splitedLine[1];
  });

  return paramObj;
}

module.exports.parseUri = parseUri;