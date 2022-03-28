//Yet another class that is not used in v1 code
export class IpMap {
	private ipMap;
	constructor () {
		this.ipMap = {};
	}
	addIpSet(ipSet: Object) {
		if(ipSet !== null) {
			Object.assign(this.ipMap, ipSet);
		}
	}
	getIpMap() {
		return this.ipMap;
	}
	getIpSet(ipSet: string) {
		return this.ipMap[ipSet];
	}
	getKeys(): Array<String> {
		return Object.keys(this.ipMap)
	}
	
}