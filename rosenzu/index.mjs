#!/bin/env node
// #!/bin/bun --intall=always
import{parse}from'toml';
import{rosenzu}from'./rosenzu.mjs';
import{readFile}from'node:fs/promises'

console.log(
	rosenzu(parse(
		await readFile('data.toml','utf8')
		// await Bun.file('data.txt').text()
	))
)
