import { Connection } from './connection';
import { ISqlDatabase } from './database-interface';

class SqlDatabase implements ISqlDatabase {
	constructor(private readonly connection: Connection) {}

	async query(queryString: string, params: any[]) {
		return this.connection.getConnectionPool().query(queryString, params);
	}
}

export { SqlDatabase };
