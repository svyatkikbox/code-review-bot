import { User } from '../types';

export interface IUserRepository {
	getByUsername(userName: string): Promise<User | null>;
}
