# piece-verification
piece-verification is a through stream that verifies data against a set of SHA1 pieces. If the pieces don’t exactly match, an error will be emitted.

[![Build status](https://travis-ci.org/michaelrhodes/piece-verification.png?branch=master)](https://travis-ci.org/michaelrhodes/piece-verification)

## example
```js
var http = require('http')
var fs = require('fs')
var verify = require('piece-verification')

// The pieces argument can either be an array of SHA1 strings
// or a Buffer of concatenated binary SHA1s.

http.get('http://site.com/some-file.mp4', function(response) {
  response
    .pipe(verify(pieces, piece_length, 'hex'))
    .on('error', function(error) {
      console.log('Invalid file')
      fs.unlinkSync(copy)
    })
    .pipe(fs.createWriteStream('./some-file-saved.mp4'))
})
```

## api
```
piece-verification(

  pieces (array[sha1_string, …] || buffer.concat[sha1_raw, …]) :
    a collection of sha1 pieces

  piece_length (number) :
    the byte length that each piece represents

  encoding (string) :
   (optional) sha1 digest encoding used by pieces

)
```


