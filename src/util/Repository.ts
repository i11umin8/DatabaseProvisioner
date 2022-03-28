import { IpMapBuilder } from './IpMapBuilder'
import { Profiles } from './ProfileEnum'
import { existsSync } from 'fs';
import * as nodegit from 'nodegit'

// this is left over code from 
//todo: convert to singleton???
export class Repository {
	private readonly repoUrl: string;
	private readonly tmpDir: string;
	private readonly profile: Profiles
	constructor(repoUrl: string, tmpDir: string, profile: string) {
		this.repoUrl = repoUrl;
		this.tmpDir = tmpDir;
		if(profile) {
			// todo: firehol defines different profiles of ip sets. do we need profiles???
		} else {
			this.profile = Profiles.ALL;
		}
	}
	async initialize() {
		console.log('initialize')
		console.log('tmpdir', this.tmpDir)
		if(!existsSync(this.tmpDir)) {
			await nodegit.Clone(this.repoUrl, this.tmpDir, {
				fetchOpts: {
				  callbacks: {
					certificateCheck: () => 0
				}
			  }
			})
		}
		// Emitter.getInstance().emit('cacheInitialized')

	}

	async generateIpMap() {
		console.time('download')
		return await new IpMapBuilder()
			.profile(this.profile)
			.directory(this.tmpDir)
			.build();
	}
}