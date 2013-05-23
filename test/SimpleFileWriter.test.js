var SimpleFileWriter = require('../lib/SimpleFileWriter');
var assert = require('assert');
var fs = require('fs');

var writer = new SimpleFileWriter('./log');

writer.write('test!');

//TODO write real test (data integrity etc)