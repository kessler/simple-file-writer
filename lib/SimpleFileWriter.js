var fs = require('fs');

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
	
	this._log = fs.createWriteStream(path, this._options);		

	this._log.on('drain', function () {
	
		self._paused = false;
		self._flushBuffer();

	});
};

SimpleFileWriter.prototype.write = function(message) {
	if (this._paused) {
		this._buffer.push(message);
	} else {		
		this._writeImpl(message);
	}
};

SimpleFileWriter.prototype._writeImpl = function(message) {	
	//this.messageCount++;	
	this._paused = !this._log.write(message);		
};

SimpleFileWriter.prototype._flushBuffer = function () {

	if (this._buffer.length === 0) return;

	if (this._paused) return;

	while (this._buffer.length > 0) {	
		this._writeImpl(this._buffer.pop());
		if (this._paused)
			break;
	}	
};

module.exports = SimpleFileWriter;