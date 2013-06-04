var fs = require('fs');
var Readable = require('stream').Readable;
var $u = require('util');

function SimpleFileWriter(path, options) {
	this._buffer = [];

	this._paused = false;
	
	//this.messageCount = 0;

	if (options === undefined)
		this._options = { flags: 'a' };
	else
		this._options = options;

	if (path !== undefined)
		this.setupFile(path);
}


SimpleFileWriter.prototype.setupFile = function(path) {
	var self = this;

	if (this._log) {
		this._log.end();
	}

	this.currentPath = path;
	
	this._log = this._createFileStream(path);
	this._log.setMaxListeners(0);
	this._log.on('drain', function () {
	
		self._paused = false;
		self._flushBuffer();

	});
};

SimpleFileWriter.prototype._createFileStream = function(path) {
	return fs.createWriteStream(path, this._options);		
};

SimpleFileWriter.prototype.write = function(message, encoding, callback) {

	if (this._paused) {	
		this._buffer.push([message, encoding, callback]);
	} else {
		this._write(message, encoding, callback);
	}
};

SimpleFileWriter.prototype._write = function(message, encoding, callback) {
	// splitted methods here seems redundant, but it makes testing easy and supports customization via overriding for specific messages
	if (message instanceof Buffer) {				
		this._writeBuffer(message, encoding, callback);
	} else if (typeof(message) === 'string') {	
		this._writeString(message, encoding, callback);		
	} else if (message instanceof Readable) {		
		this._writeStream(message, encoding, callback);
	} else {
		this._writeOther(message, encoding, callback);
	}
};

SimpleFileWriter.prototype._writeString = function(message, encoding, callback) {		
	this._paused = !this._log.write(message, encoding, callback);		
};

SimpleFileWriter.prototype._writeBuffer = function(message, encoding, callback) {	
	this._paused = !this._log.write(message, encoding, callback);			
};

/*
	TODO:	
	Why rows were missing one or two digits at the start if setImmediate is not used? (data integrity tests failed)
	also I had to do setMaxListeners(0) on this, dont like that either.... need to check this out more 
*/
SimpleFileWriter.prototype._writeStream = function(stream, encoding, callback) {
	if (typeof(encoding) === 'function')
		callback = encoding;

	this._paused = true;	
	stream.pipe(this._log, { end: false });
	var self = this;

	stream.on('end', function () {
		self._paused = false;
		
		if (callback)
			callback(self._paused);

		setTimeout(function () {			
			self._flushBuffer();	
		}, 10);
	});
};

SimpleFileWriter.prototype._writeOther = function(message, encoding, callback) {
	throw new Error('invalid message: ' + $u.inspect(message) + '. you should override _writeOther in a subclass if you know how to handle this message');
};

SimpleFileWriter.prototype._flushBuffer = function () {

	if (this._buffer.length === 0) return;
	
	if (this._paused) return;

	while (this._buffer.length > 0) {	
		var messageArguments = this._buffer.pop();
		
		this._write(messageArguments[0], messageArguments[1], messageArguments[2]);
	
		if (this._paused)
			break;
	}	
};

module.exports = SimpleFileWriter;