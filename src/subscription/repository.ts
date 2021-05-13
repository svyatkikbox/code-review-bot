import { ISubscription } from './repository-interface';
import { Subscription } from './types';

// TODO перекинуть этот хардкод на взаимодействие с пользователем и сохранение в БД
// шоб можно было отписку/подписку добавлять на проекты
const PROJECTS = [
	{ name: 'uKit', id: 1 },
	{ name: 'ira', id: 206 },
	{ name: 'spasi', id: 210 },
	{ name: 'saga', id: 212 },
];
class SubscriptionRepository implements ISubscription {
	constructor() {}

	async getUserSubscriptions(username: string): Promise<Subscription> {
		const subscribedProjects = PROJECTS;
		return { projects: subscribedProjects };
	}
}

export { SubscriptionRepository };
