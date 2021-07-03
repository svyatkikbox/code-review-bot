export interface ISqlDatabase {
	query(
		queryString: string,
		params?: Array<string | number | boolean>
	): Promise<unknown>;
}
