var fs = require('fs')
function parser(format){
	this.directives = []
	var directive = /\$([a-z_]+)/

	while(true){
		var key = format.match(directive)
		if (key) {
			format = format.replace(key[0] , '%%')
			this.directives.push(key[1])
		}else{
			break
		}
	}
	format = format.replace(/([\[\]\-])/g , '\\$1')
					.replace(/\%%/g , '([\\s\\S]*)')


	this.parser = new RegExp(format)

}

parser.prototype.test = function(log){
	return this.parseLine(log)
}

parser.prototype.parseLine = function(line , iterator){
	///console.log(line.toString())
	if (!line) return
	var match = line.toString().match(this.parser)
	if (!match) return
	var row = {}
	for (var i = 0 , j = this.directives.length; i < j ; i ++){
		row[this.directives[i]] = match[i+1]
	}
	if (iterator) iterator(row)
	return row
}

parser.prototype.read = function(path, options, iterator, callback){
	return this.stream(fs.createReadStream(path), iterator, callback)
}

parser.prototype.stream = function (stream, iterator, callback){
	var buff = new Buffer(0)
		,pos = 0
		,parseLine = this.parseLine.bind(this)

	stream.on('data', function (data) {
		buff = Buffer.concat([buff , data])
		for (var i = 0, len = buff.length; i < len; i++) {
			if (10 === buff[i] ) {
				parseLine(buff.slice(pos, i) , iterator )
				pos = i + 1
			}
		}
		buff = buff.slice(pos)
	})
	stream.on('error', function (err) {
		if (callback) callback(err)
	})
	stream.on('close' , function(){
		parseLine(buff , iterator)
		if (callback) callback()
	})
    if (stream.resume) {
        process.nextTick(function () {
            stream.resume();
        });
    }
	return stream
}

module.exports =  parser
