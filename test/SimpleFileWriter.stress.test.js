var SimpleFileWriter = require('../lib/SimpleFileWriter');
var assert = require('assert');
var testutil = require('./testutil');
var fs = require('fs');

// TEST PARAMS
var rows = 10000;
var rowSize = 10000;
var rowData = testutil.createRowData(rowSize);

describe('stress string test - ', function () {

	it('write lots of strings', function (done) {
		var logfile = require('node-uuid')();
		testutil.logs.push(logfile);

		var writer = new SimpleFileWriter(logfile);

		var writes = 0;

		var last = 0;

		var sum = 0;

		var reporter = setInterval(function () {
			if (last > 0) {
				var delta = writes - last;
				if (delta > 0)
					console.log(delta);

				sum += delta;
			}

			last = writes;
		}, 10)

		function callback() {
			if (++writes === rows) {		
				reporter.unref();
				console.log('average %s', sum / writes);
				fs.readFile(logfile, 'utf8', testutil.verifyDataIntegrity(rows, rowSize, done));		
			}
		}

		for (var x = 0; x < rows; x++) 
		 	writer.write(rowData, callback);		

		this.timeout(15000);
		
	});

	it('write lots of streams (pipes them)', function (done) {
		var logfile = require('node-uuid')();
		testutil.logs.push(logfile);
		var writer = new SimpleFileWriter(logfile);

		var writes = 0;

		var last = 0;

		var sum = 0;

		var reporter = setInterval(function () {
			if (last > 0) {
				var delta = writes - last;
				if (delta > 0)
					console.log(delta);

				sum += delta;
			}

			last = writes;
		}, 1000)

		function callback() {
			if (++writes === rows) {		
				reporter.unref();
				console.log('average %s', sum / writes);
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
