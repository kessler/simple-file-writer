var SimpleFileWriter = require('../lib/SimpleFileWriter');
var assert = require('assert');
var Readable = require('stream').Readable;
var $u = require('util');
var fs = require('fs');
var testutils = require('./testutil');
var uuid = require('node-uuid');
var ROWS = 100;
var ROW_SIZE = 2511;

function newWriter(logname, dontPush) {
	if (!dontPush)
		testutils.logs.push(logname)

	return new SimpleFileWriter(logname);
}

describe('basic tests - write stuff to disk - ', function () {
	it('strings with specified encoding', function (done) {
		var logfile = uuid();
		var writer = newWriter(logfile);

	 	writer.write(new Buffer('boo').toString('base64'), 'base64');		

		this.timeout(2000);
		setTimeout(function () {
			fs.readFile(logfile, 'base64', function(err, data) {
				if (err) {
					assert.fail(err);					
				}

				assert.strictEqual(new Buffer('boo').toString('base64'), data)
				done();
			});	
		}, 1000)
	});

	it('strings with a callback', function (done) {
		var logfile = uuid();
		var writer = newWriter(logfile);
		var callbackCalled = false;

	 	writer.write('boo', function() {
	 		callbackCalled = true;
	 	});		

		this.timeout(2000);
		setTimeout(function () {
			fs.readFile(logfile, function(err, data) {
				if (err) {
					assert.fail(err);					
				}

				assert.deepEqual(new Buffer('boo'), data)
				assert.strictEqual(true, callbackCalled, 'callback not fired');
				done();
			});	
		}, 1000)
	});


	it('strings with a callback and encoding specified', function (done) {
		var logfile = uuid();
		var writer = newWriter(logfile);
		var callbackCalled = false;

	 	writer.write(new Buffer('boo').toString('base64'), 'base64', function() {
	 		callbackCalled = true;
	 	});		

		this.timeout(2000);
		setTimeout(function () {
			fs.readFile(logfile, 'base64', function(err, data) {
				if (err) {
					assert.fail(err);					
				}

				assert.strictEqual(new Buffer('boo').toString('base64'), data)
				assert.strictEqual(true, callbackCalled, 'callback not fired');
				done();
			});	
		}, 1000)
	});

	it('buffers', function (done) {
		var logfile = uuid();
		var writer = newWriter(logfile);

	 	writer.write(new Buffer('boo'));		

		this.timeout(2000);
		setTimeout(function () {
			fs.readFile(logfile, function(err, data) {
				if (err) {
					assert.fail(err);					
				}

				assert.deepEqual(new Buffer('boo'), data)
				done();
			});	
		}, 1000)
	});

	it('buffers with callback', function (done) {
		var logfile = uuid();
		var writer = newWriter(logfile);
		
		var callbackCalled = false;
	 	writer.write(new Buffer('boo'), function() {
	 		callbackCalled = true;
	 	});		

		this.timeout(2000);
		setTimeout(function () {
			fs.readFile(logfile, function(err, data) {
				if (err) {
					assert.fail(err);					
				}

				assert.deepEqual(new Buffer('boo'), data)
				assert.strictEqual(true, callbackCalled, 'callback not fired');
				done();
			});	
		}, 1000)
	});
});