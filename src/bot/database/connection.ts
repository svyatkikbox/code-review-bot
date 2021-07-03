import { Pool } from 'pg';

class Connection {
	private connectionPool;

	constructor(connectionUrl: string) {
		if (!connectionUrl) {
			throw Error('Connection string is empty');
		}
		this.connectionPool = new Pool({ connectionString: connectionUrl });
	}

	getConnectionPool() {
		return this.connectionPool;
	}
}

export { Connection };
