import { AxiosInstance } from 'axios';
import { User } from '../types';
import { IUserRepository } from './repository-interface';

export class UserRepository implements IUserRepository {
	constructor(private readonly gitlabAPI: AxiosInstance) {}

	async getByUsername(userName: string): Promise<User | null> {
		const { data: usersData } = await this.gitlabAPI.get(
			`users?username=${userName}`
		);

		// TODO runtime validation of incoming data
		const user = (usersData as User[]).find(u => u.userName === userName);

		if (!user) {
			return null;
		}

		return user;
	}
}
