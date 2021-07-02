import { Pool } from 'pg';

import config from '../config';

const pool = new Pool({
	connectionString: config.DATABASE_URL,
});

interface ISqlDatabase {
	query(
		queryString: string,
		params?: string | number | boolean[]
	): Promise<unknown>;
}

const SqlDatabase: ISqlDatabase = {
	query: (queryString: string, params: any[]) =>
		pool.query(queryString, params),
};

export { SqlDatabase, ISqlDatabase };
