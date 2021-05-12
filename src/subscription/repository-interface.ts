import { Subscription } from './types';

interface ISubscription {
	getUserSubscriptions(username: string): Promise<Subscription[]>;
}

export { ISubscription };
