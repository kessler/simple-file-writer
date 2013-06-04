var SimpleFileWriter = require('../lib/SimpleFileWriter');
var $u = require('util');
var Readable = require('stream').Readable;
var assert = require('assert');
var testutil = require('./testutil');
var fs = require('fs');


// TEST PARAMS
var rows = 10000;
var rowSize = 1333;
var rowData = testutil.createRowData(rowSize);
var logfile = require('node-uuid')();

describe('stress streams test - ', function() {

	it('write lots of streams (pipes them)', function (done) {

		$u.inherits(TestStream, Readable);
		function TestStream(data) {
			Readable.call(this);

			this.data = data;
			this.progress = 0;
			this.step = Math.round(rowSize / 2);
		}

		TestStream.prototype._read = function(n) {
			
			var start = this.progress;
			this.progress += this.step;
			this.push(this.data.substr(start, this.step));		

			if (this.progress >= this.data.length) {								
				return this.push(null);
			}
		};

		testutil.logs.push(logfile);
		var writer = new SimpleFileWriter(logfile);
		var writes = 0;

		function callback() {
			if (++writes === rows) {			
				fs.readFile(logfile, 'utf8', testutil.verifyDataIntegrity(rows, rowSize, done));					
			}
		}
		
		for (var x = 0; x < rows; x++) {
			var s = new TestStream(rowData);
			writer.write(s, callback);		
		}

		this.timeout(20000);		

	});
});