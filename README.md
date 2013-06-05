simple file writer
===================

A file writer. Handles backpressure by buffering. You don't always want to do that, probably most of the time you don't... 
 
###Install

```
npm install simple-file-writer
```

###usage example 1

```
	var SimpleFileWriter = require('simple-file-writer');

	var writer = new SimpleFileWriter('./1.log');

	writer.write('yey!');

	writer.setupFile('./2.log');

	writer.write('yey!');	
```

### usage example 2 (experimental)
```
	var SimpleFileWriter = require('simple-file-writer');

	var writer = new SimpleFileWriter('./1.log');

	var http = require('http');

	http.createServer(function(request, response) {		
		//pipe to file
		writer.write(request, function () {
			response.end();
		});
	});

	http.listen(8181, function() {
		console.log('server listening');
	});
	
```