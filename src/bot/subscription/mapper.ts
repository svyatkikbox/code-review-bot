import { Subscription, SubscriptionRaw } from './types';
import { IMapper } from '../../mapper-interface';

// TODO finish mapper
export class SubscriptionMap implements IMapper<Subscription, SubscriptionRaw> {
	toModel(entity: Subscription): SubscriptionRaw {
		return {} as SubscriptionRaw;
	}

	toDomain(raw: SubscriptionRaw): Subscription {
		return {} as Subscription;
	}
}
