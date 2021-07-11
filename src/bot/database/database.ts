import { Pool } from 'pg';

class SqlDatabase {
	private connectionPool;

	constructor(connectionUrl: string) {
		if (!connectionUrl) {
			throw Error('Connection string is empty');
		}
		this.connectionPool = new Pool({ connectionString: connectionUrl });
	}

	async query(queryString: string, params: any[]) {
		return this.connectionPool.query(queryString, params);
	}
}

export { SqlDatabase };
