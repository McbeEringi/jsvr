#!/bin/bun --intall=always
import{parse}from'toml';
import{rosenzu}from'./rosenzu.mjs';

console.log(
	rosenzu(parse(
		await Bun.file('data.toml').text()
	))
)
