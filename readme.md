# piece-verification-stream

## example
```js
var http = require('http')
var fs = require('fs')
var verify = require('piece-verification-stream')

// The pieces argument can either be an array of SHA1 strings
// or a Buffer of concatenated binary SHA1s.

http.get('http://site.com/some-file.mp4')
  .pipe(verify(pieces, piece_length, 'hex'))
  .on('error', function(error) {
    console.log('Invalid file')
    fs.unlinkSync(copy)
  })
  .pipe(fs.createWriteStream('./some-file-saved.mp4'))
```
