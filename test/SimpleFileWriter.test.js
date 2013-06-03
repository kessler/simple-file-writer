var SimpleFileWriter = require('../lib/SimpleFileWriter');
var assert = require('assert');
var Readable = require('stream').Readable;
var $u = require('util');
var fs = require('fs');

var ROWS = 100;
var ROW_SIZE = 2511;

$u.inherits(TestStream, Readable);
function TestStream(data) {
	Readable.call(this);

	this.data = data;
	this.progress = 0;
	this.step = Math.round(ROW_SIZE / 2);
}

/*
	this is a slow stream :)
*/
TestStream.prototype._read = function(n) {
	
	var start = this.progress;
	this.progress += this.step;
	this.push(this.data.substr(start, this.step));		

	if (this.progress >= this.data.length) {								
		return this.push(null);
	}
};

var s1 = '';

for (var s = 0; s < ROW_SIZE; s++) {
	if (s > 0)
		s1 += ',';

	s1 += s;
}

s1 += '\n';

var expectedSum = ((ROW_SIZE - 1) * ROW_SIZE) / 2;

function verifyDataIntegrity(done, name) {
	return function(err, content) {			

		var rows = content.split('\n');
		assert.strictEqual(ROWS + 1, rows.length, name + ' expected ' + ROWS + ' rows to be written');	
		assert.strictEqual(rows[ROWS], '', name + ' expected last row to be empty');
		rows.pop(); // remove last empty line

		for (var i = 0; i < rows.length; i++) {
			var row = rows[i].split(',');
			
			assert.strictEqual(ROW_SIZE, row.length, name + ' expected to find ' + ROW_SIZE + ' numbers in row ' + i + ' but it was ' + row.length);

			fs.writeFileSync('lkjasd', $u.inspect(row));

			var sum = 0;
			for (var x = 0; x < row.length; x++)
				sum += parseInt(row[x]);

			assert.strictEqual(expectedSum, sum, name + ' unexpected sum in a row ' + i);
		}

		done();
	}
}

describe('write stuff to disk', function () {
	it('writes simple strings', function (done) {
		var writer = new SimpleFileWriter('./log1');

		for (var x = 0; x < ROWS; x++) 
		 	writer.write(s1);		

		this.timeout(15000);
		setTimeout(function () {
			fs.readFile('./log1', 'utf8', verifyDataIntegrity(done, '1'));	
		}, 5000)
	});


	it('writes streams (pipes them)', function (done) {
		var writer = new SimpleFileWriter('./log2');

		for (var x = 0; x < ROWS; x++) 
			writer.write(new TestStream(s1));

		this.timeout(38000);
		setTimeout(function () {
			fs.readFile('./log2', 'utf8', verifyDataIntegrity(done, '2'));	
		}, 35000)
	});
	
});

process.on('exit', function () {
	
	try {
		fs.unlinkSync('./log1');		
	} catch (e) {}	

	try {
		fs.unlinkSync('./log2');	
	} catch (e) {}	
	
});





// //TODO write real test (data integrity etc)