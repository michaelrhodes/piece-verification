var crypto = require('crypto')
var BlockStream = require('block-stream')
var through = require('through2')
var stream = require('stream-splicer')

module.exports = function(pieces, pieceLength, hashEncoding) {
  var index = 0

  if (Buffer.isBuffer(pieces)) {
    var buffer = pieces
    pieces = []

    for (var i = 0, l = buffer.length, piece; i < l; i += 20) {
      piece = buffer.slice(i, i + 20)
      pieces.push(hashEncoding ?
        piece.toString(hashEncoding) :
        piece
      )
    }
  }

  var chunk = new BlockStream(pieceLength, {
    nopad: true
  })

  var check = through(
    function transform(chunk, encoding, next) {
      var piece = pieces[index++]
      piece = piece ? piece.toString() : null

      var hash = crypto.createHash('sha1')
        .update(chunk)
        .digest(hashEncoding)
        .toString()

      if (hash !== piece) {
        var similar = piece && hash.length === piece.length
        return this.emit('error', new Error(
          !piece ? 'Not enough pieces' :
            similar ? 'Wrong piece' :
            'Encoding mismatch'
        ))
      }

      this.push(chunk)
      next()
    },
    function flush() {
      if (pieces.length > index) {
        this.emit('error', new Error(
          'Too many pieces'
        )) 
      }
    }
  )
  
  return stream([chunk, check])
}
