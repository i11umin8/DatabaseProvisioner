import * as config from 'config'
import { Repository } from './util/Repository';
import { DatabasePopulator } from './util/DatabasePopulator';
import { DatabaseConnector } from './util/DatabaseConnector';

const ttl = config.ttl
const dirLocation = config.dirLocation

const provisionDatabase = async () => {

    console.time('download & parse')
    
    const provisioner = new Repository(config.repoUrl, dirLocation, config.profile)
    await provisioner.initialize()

    console.timeEnd('download & parse')
    const connection = await DatabaseConnector.getDatabaseConnection(config.dbUrl, config.dbUser, config.dbPassword, config.tls)
    console.log('done with conencting')
    const populator = new DatabasePopulator(dirLocation)
    await populator.populateDatabase(connection, ttl)
}
export default provisionDatabase

