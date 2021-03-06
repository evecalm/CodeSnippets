var http = require('http');

function httpRequest (opt, reqBody, res) {
  var req = http.request(opt,function (cres) {
    console.log(cres.statusCode);
    res.writeHead(cres.statusCode, cres.headers);
    cres.on('data', function (chunk) {
      res.write(chunk, 'binary');
    }).on('end',function () {
      res.end();
    });
  });
  req.on('error', function (error) {
    res.writeHead(500);
    res.end(error.message);
    // console.log( error.stack );
  });
  req.write(reqBody);
  req.end();
}

http.createServer(function (req, res) {
  var rUrl = /https?:\/\/([^/]+)(.*)/,
    m = rUrl.exec(req.url);
  var opt = {
      host: m[1],
      method: req.method,
      path: m[2],
      headers: req.headers
    },
    reqBody = '';

  req.on('data', function (chunk) {
    reqBody += chunk;
  });
  req.on('end', function () {
    httpRequest(opt, reqBody, res);
  });
  console.log(req.url);
}).listen(8888);

console.log('proxy started at 8888');
