export interface Mapper<T, U> {
	toDomain(raw: U): T;
	toModel(entity: T): U;
}
