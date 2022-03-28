import { Profiles } from './ProfileEnum'
import { BasicProfile } from './BasicIpSetEnum'
import { IpMap } from './IpMap';
import { promises } from 'fs'
import { IpSetParser } from './IpSetParser'
import { readdirSync, statSync } from 'fs'
import * as path from 'path'
// Wanted to experiment with making a map of ips to blocklists. This would allow me to easily insert ips as primary keys in db, which would speed up queries and eliminate duplicates
// its probably overkill to use a builder at this point, but it seems that there may be many more ways to configure this IP list. 
export class IpMapBuilder {

		private readonly ipMap: IpMap;
		private dir: string;
		// I started making this just in case we would need the functionality to specify certain blocklist profiles. That does not seem to be the case. 
		private blocklistProfile: Profiles
		private ipsetExtension = ".ipset";
		private netsetExtension = ".netset";
		constructor() {
			this.ipMap = new IpMap();
		}

		profile(profile: Profiles) {
			this.blocklistProfile = profile
			return this;
		}

		directory(dir: string) {
			this.dir = dir;
			return this;
		}

		refreshTime() {
			return this;
		}

		build() {
			this.generateIpMap();
			return this.ipMap;
		}

		private async generateIpMap() {
		}

}
