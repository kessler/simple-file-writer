var SimpleFileWriter = require('../lib/SimpleFileWriter');
var assert = require('assert');
var testutil = require('./testutil');
var fs = require('fs');
var config = require('./testconfig')['bigchunk.test'];

// TEST PARAMS
var rows = config.rows;
var rowSize = config.rowSize;
var rowData = testutil.createRowData(rowSize);

describe('big chunk test - ', function () {

	it('streams', function (done) {
		var logfile = testutil.newLogFilename();
		
		var writer = testutil.newWriter(logfile);

		var writes = 0;

		var start = Date.now();

		function callback() {
			if (++writes === rows) {						
				console.log('average %s (writes/ms)', writes / (Date.now() - start));
				console.log('verifying data integrity');				
				fs.readFile(logfile, 'utf8', testutil.verifyDataIntegrity(rows, rowSize, done));
			}
		}
		
		for (var x = 0; x < rows; x++) {
			var s = new testutil.TestStream(rowData);
			writer.write(s, callback);		
		}

		this.timeout(20000);	
	});
});