export interface IMapper<T, U> {
	toDomain(raw: U): T;
	toModel(entity: T): U;
}
