import { BotScene } from '../types';
import { findProjectsStep } from './steps/find-project-step';
import { findUserStep } from './steps/find-user-step';

export const registrationScene: BotScene = {
	enteringStepId: findUserStep.stepId,
	steps: [findUserStep.step, findProjectsStep.step],
};
