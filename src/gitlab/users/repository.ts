import { GitlabAPI } from '../gitlab-api';
import { User } from '../types';
import { IUserRepository } from './repository-interface';

export class UserRepository implements IUserRepository {
	constructor(private readonly gitlabAPI: GitlabAPI) {}

	async getByUsername(userName: string): Promise<User | null> {
		const usersData = await this.gitlabAPI.getUserByUsername(userName);

		const user = usersData.find(u => u.userName === userName);

		if (!user) {
			return null;
		}

		return user;
	}
}
