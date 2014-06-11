# piece-verification-stream

## example
```js
var http = require('http')
var fs = require('fs')
var verify = require('piece-verification-stream')

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
verify(

  pieces (array[sha1_string, …] || buffer.concat[sha1_raw, …]) :
    a collection of sha1 pieces

  piece_length (number) :
    the byte length that each piece represents

  encoding (string) :
   (optional) sha1 digest encoding used by pieces

)
```


