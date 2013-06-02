var SimpleFileWriter = require('../lib/SimpleFileWriter');
var assert = require('assert');
var fs = require('fs');

var writer = new SimpleFileWriter('./log');

for (var x = 0; x < 1000; x++) {
	writer.write('test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! test! ');

	var stream = fs.createReadStream('../LICENSE');
	writer.write(stream);
}



//TODO write real test (data integrity etc)