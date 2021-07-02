import { Subscription } from './types';

interface ISubscriptionRepository {
	getUserSubscriptions(username: string): Promise<Subscription>;
}

export { ISubscriptionRepository };
