import { dictionary } from '../../dictionary';
import { MergeRequest } from '../../gitlab/types';
import { IRenderStrategy } from './render-strategy-interface';

export class RenderReviewCallsStrategy implements IRenderStrategy {
	render(mrsData: MergeRequest[]) {
		let markup = `<b>${dictionary.commands.whereYouWereMentioned}</b>\n`;

		for (const mrData of mrsData) {
			const { webUrl, title, upvotes, downvotes } = mrData;
			markup += `<a href="${webUrl}">${title}</a> 👍 ${upvotes} 👎 ${downvotes}\n`;
		}

		return markup;
	}
}
