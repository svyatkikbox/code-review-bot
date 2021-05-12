import { findProjectsStep } from './steps/find-project-step';
import { findUserStep } from './steps/find-user-step';

export const registrationScene = {
	enteringStepId: findUserStep.stepId,
	steps: [findUserStep.step, findProjectsStep.step],
};
