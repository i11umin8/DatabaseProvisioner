import { readFileSync } from 'fs';
import * as path from 'path';
import * as net from 'net'
export class IpSetParser {
	static parseIpSet(filePath: string) {
		const fileContents = readFileSync(filePath, "utf-8");
		const ips = fileContents
			.split(/\r?\n/)
			.map((line) => (line.trim()))
			.filter((line) => (net.isIP(line)));
		const ipSetKey = path.parse(filePath).name;
		return  ips !== [] ? {key: ipSetKey, ips: ips}: null
	}
}