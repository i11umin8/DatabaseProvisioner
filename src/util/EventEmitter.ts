import { EventEmitter } from 'events'

export class Emitter extends EventEmitter{
	private static instance: Emitter;

	public static getInstance(): Emitter {
		if(!Emitter.instance) {
			Emitter.instance = new Emitter();
		}
		return Emitter.instance
	}
}