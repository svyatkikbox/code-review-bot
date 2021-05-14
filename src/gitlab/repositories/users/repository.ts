import { GitlabAPI } from '../../gitlab-api';
import { User } from '../types';
import { IUserRepository } from './repository-interface';

export class UserRepository implements IUserRepository {
	constructor(private readonly gitlabAPI: GitlabAPI) {}

	async getUserByUsername(username: string): Promise<User | null> {
		const usersData: User[] = await this.gitlabAPI.getUserByUsername(username);
		const user = usersData.find(u => u.username === username);

		if (!user) {
			return null;
		}

		return user;
	}
}
