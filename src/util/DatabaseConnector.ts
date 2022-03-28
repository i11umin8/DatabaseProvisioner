import { MongoClient } from 'mongodb'

export class DatabaseConnector {

    static async getDatabaseConnection(dbUrl: string, dbUser: string, dbPassword: string, tls: string) {
        const uriWithAuth = dbUser && dbPassword ? `ipblocker:testtest@${dbUrl}` : dbUrl
        const databaseConnectionUrl = `mongodb://${uriWithAuth}/ipblocker`

    console.log('databse', databaseConnectionUrl)
    const client = 
        tls 
        ?  new MongoClient(databaseConnectionUrl, {tlsCAFile: 'rds-combined-ca-bundle.pem', directConnection: true,  tls: true, retryWrites: false, minPoolSize: 25})
        :  new MongoClient(databaseConnectionUrl, {minPoolSize: 25})
        console.log('attempting connection')
        await client.connect();
        return client
    }
}
