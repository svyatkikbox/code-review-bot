import { User } from '../types';

export interface IUserRepository {
	getUserByUsername(username: string): Promise<User | null>;
}
