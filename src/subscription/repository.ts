import { ISubscription } from './repository-interface';
import { Subscription } from './types';

class SubscriptionRepository implements ISubscription {
	constructor() {}

	async getUserSubscriptions(username: string): Promise<Subscription[]> {
		throw new Error('Method not implemented.');
	}
}

export { SubscriptionRepository };
