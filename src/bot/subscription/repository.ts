import { IMapper } from '../../mapper-interface';
import { SqlDatabase } from '../database/database';
import { ISubscriptionRepository } from './repository-interface';
import { Subscription, SubscriptionRaw } from './types';

const Subscription = { userId: 1, projects: [{ name: 'uKit', id: 1 }] };

class SqlSubscriptionRepository implements ISubscriptionRepository {
	constructor(
		private readonly db: SqlDatabase,
		private readonly mapper: IMapper<Subscription, SubscriptionRaw>
	) {}

	async createSubscription(
		userId: string,
		projectIds: number[]
	): Promise<Subscription> {
		const subscriptionModel = await this.db.query(
			'INSERT INTO subscriptions (user_id, project_ids) ($1, $2)',
			[userId, projectIds]
		);

		const subscription = this.mapper.toDomain(
			subscriptionModel as unknown as SubscriptionRaw
		);

		return subscription;
	}

	async getUserSubscriptions(username: string): Promise<Subscription> {
		return Subscription;
	}
}

export { SqlSubscriptionRepository };
