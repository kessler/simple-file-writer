simple file writer
===================

A file writer. Handles backpressure by buffering. 

###Install

```
npm install simple-file-writer
```

###usage

```
	var SimpleFileWriter = require('simple-file-writer');

	var writer = new SimpleFileWriter('./1.log');

	writer.write('yey!');

	writer.setupFile('./2.log');

	writer.write('yey!');	

	var fs = require('fs');

	var rs = fs.createReadStream('somefile');

	writer.write(rs); // piped to the underlying write stream
```

###TODO:
test "buffering" and "buffering when backpressured" are working as expected

