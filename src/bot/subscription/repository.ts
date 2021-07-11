import { SqlDatabase } from '../database/database';
import { ISubscriptionRepository } from './repository-interface';
import { Subscription } from './types';

// TODO move in db operations
const PROJECTS = [{ name: 'uKit', id: 1 }];

class SqlSubscriptionRepository implements ISubscriptionRepository {
	constructor(private readonly db: SqlDatabase) {}

	async createSubscription() {}

	async getUserSubscriptions(username: string): Promise<Subscription> {
		const subscribedProjects = PROJECTS;
		return { projects: subscribedProjects };
	}
}

export { SqlSubscriptionRepository };
