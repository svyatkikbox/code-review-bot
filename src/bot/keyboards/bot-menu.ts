import { KeyboardButton } from 'telegraf/typings/core/types/typegram';

import { dictionary } from '../../dictionary';

const showNeedReviewsBtn: KeyboardButton = {
	text: dictionary.buttons.showNeedReviews,
};
const showMyOpenMrsCommandBtn: KeyboardButton = {
	text: dictionary.buttons.showMyOpenMrsCommand,
};

export const menuKeyboard = [showNeedReviewsBtn, showMyOpenMrsCommandBtn];
