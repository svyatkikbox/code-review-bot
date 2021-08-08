import { User, UserRaw } from '../types';
import { IMapper } from '../../mapper-interface';

export class UserMap implements IMapper<User, UserRaw> {
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
