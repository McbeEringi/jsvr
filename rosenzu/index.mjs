#!/bin/env node
// #!/bin/bun --intall=always
import{rosenzu}from'./rosenzu.mjs';
import{readFile}from'node:fs/promises'

console.log(
	rosenzu(
		(await readFile('data.txt','utf8')).replace(/\r\n/g,'\n')
		// await Bun.file('data.txt').text()
	)
)
