import * as config from 'config'
import { Repository } from './util/Repository';
import { DatabasePopulator } from './util/DatabasePopulator';
import { DatabaseConnector } from './util/DatabaseConnector';

console.log('hello world!!')
console.log('config',config)
const uri = config.dbUrl
const user = config.dbUser
const password = config.dbPassword
const ttl = config.ttl
const dirLocation = config.dirLocation
const uriWithAuth = user && password ? `${user}:${password}@${uri}` : uri
const databaseConnectionUrl = `mongodb://${uriWithAuth}/ipblocker`
console.log('uri', databaseConnectionUrl)

const provisionDatabase = async () => {

    console.time('download & parse')
    
    const provisioner = new Repository(config.repoUrl, dirLocation, config.profile)
    await provisioner.initialize()

    //part of 
    // const ipMap = await provisioner.generateIpMap()
    console.timeEnd('download & parse')
    const connection = await DatabaseConnector.getDatabaseConnection(config.dbUrl, config.dbUser, config.dbPassword, config.tls)
    console.log('done with conencting')
    const populator = new DatabasePopulator(dirLocation)
    await populator.populateDatabase(connection, ttl)
}
export default provisionDatabase

