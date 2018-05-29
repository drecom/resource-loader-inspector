var http = require('http');
var fs   = require('fs');

var HOST = process.env.EXAMPLE_HOST || 'localhost';
var PORT = process.env.EXAMPLE_PORT || 8888;

http.createServer(function (request, response) {
  var url = decodeURIComponent(request.url);

  if (url === '/') { url = '/index.html'; }

  var url = url.split('?')[0];
  var chunks = url.split('.');
  var extension = chunks[chunks.length - 1];

  var contentType = 'text/html';

  // or may be leave them to browser with no Content-Type header
  if (/^js$/i.test(extension)) {
    contentType = 'text/javascript';
  } else if (/^md/i.test(extension)) {
    contentType = 'text/plain';
  } else if (/^mp3/i.test(extension)) {
    contentType = 'audio/mp3';
  } else if (/^mp4/i.test(extension)) {
    contentType = 'video/mp4';
  } else if (/^bin/i.test(extension)) {
    contentType = 'application/octet-stream';
  } else if (/^png$/i.test(extension)) {
    contentType = 'image/png';
  } else if (/^icon?$/i.test(extension)) {
    response.writeHead(404, {});
    response.end();

    return;
  }

  fs.readFile('./www' + url, function (error, content) {
    if (error) { throw error; }

    response.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': content.length
    });
    response.write(content);
    response.end();
  });
}).listen(PORT, HOST);

console.log('\nServer is runing on http://' + HOST + ':' + PORT);
console.log('You can specify host and port by setting environment values as below;\n');
console.log('EXAMPLE_HOST: host name like "localhost"');
console.log('EXAMPLE_PORT: port number like 8888');
