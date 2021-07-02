import { BaseScene } from 'telegraf/typings/scenes/base';
import {
	SceneContext,
	SceneSessionData,
} from 'telegraf/typings/scenes/context';

export type BotScene = {
	enteringStepId: string;
	steps: BaseScene<SceneContext<SceneSessionData>>[];
};
