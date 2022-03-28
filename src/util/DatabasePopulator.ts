import { MongoClient, Db } from "mongodb";
import * as path from 'path'
import { readdirSync, statSync } from 'fs'
import { IpSetParser } from './IpSetParser'

export class DatabasePopulator {
    private dir: string;
    private ipsetExtension = ".ipset"
    private netsetExtension = ".netset"
    private readonly collectionName = 'ips'
    constructor(dir: string) {
        this.dir = dir;
    }

    private recursivelyReadFiles(dir, callback: Function) : void {
        readdirSync(dir).forEach(f => {
            const dirPath = path.join(dir, f);
            const isDirectory = statSync(dirPath).isDirectory();
            const isIpFile = f.includes(this.ipsetExtension) || f.includes(this.netsetExtension)
            if(isDirectory) {
                this.recursivelyReadFiles(dirPath, callback)
            } else if (isIpFile) {
                callback(path.join(dir, f))
            }
          });
    }

    private insertIpData(db: Db, promises: Array<Promise<void>>) {
        const collectionName = this.collectionName
        return function (file: string) {
            const parsedSet = IpSetParser.parseIpSet(file)
            const dbRefreshTime = new Date();
            const mapped = parsedSet.ips.map((ip) => ({"dataRefreshTime": dbRefreshTime, ipSet: parsedSet.key, ip: ip}))
            if(mapped.length) {
                promises.push(new Promise((resolve, reject) => {
                    db.collection(collectionName).insertMany(mapped, {ordered:false})
                        .then(() => (resolve()))
                        .catch((reason) => (reject(reason)))
                }))
            }
        }
    }

    // TODO: I cleaned and refactored this code and now its slower. Find out why. 
    // We should batch the insert statements
    // also: by generating a map of ips to blocklists, we can insert the ip as the primary key and spee
    public async populateDatabase(client: MongoClient, ttl: number) {
        const db = await client.db()
        await this.createCollection(db)
        await this.createIndex(db, ttl)
        const promises: Array<Promise<void>> = []
        console.log('populating database')
        console.time('databasePopulation')
        this.recursivelyReadFiles(this.dir, this.insertIpData(db, promises))
        await Promise.all(promises)
    
        console.timeEnd('databasePopulation')
        await client.close()
    }
    
    private async createCollection(db: Db) {
        try {
            console.log('creating collection')
            await db.createCollection(this.collectionName)
        } catch (e) {
            if(e.message.includes('already exists')) {
                console.log("Collection already exists. Continuing")
            } else {
                throw(e)
            }
        }
    }
    private async createIndex(db: Db, ttl: number) {
        if(!(await db.collection(this.collectionName).indexExists(['dataRefreshTime_1']))) {
            await db.collection(this.collectionName).createIndex({'dataRefreshTime':1}, {expireAfterSeconds: ttl})
        }
    }
}