import { User, UserRaw } from '../gitlab/types';
import { Mapper } from './mapper-interface';

export class UserMap implements Mapper<User, UserRaw> {
	toModel(entity: User): UserRaw {
		throw new Error('Method not implemented');
	}

	toDomain(raw: UserRaw): User {
		return {
			...raw,
			userName: raw.username,
		};
	}
}
