import * as cron from 'node-cron';

import { database, gitlabService } from '../app';

export const updateReviewDataTask = cron.schedule(
	'* * * * *',
	async () => {
		console.log('task started');
		console.log(new Date().toISOString());

		const projectId = 1;
		const projectReviewCalls = await gitlabService.getProjectReviewsData(
			projectId
		);
		const data = JSON.stringify(projectReviewCalls);

		console.dir({ dataL: data.length });

		try {
			const response = await database.query(
				`
				INSERT INTO merge_requests_data_cache(project_id, data_cache)
				VALUES($1, $2)
				ON CONFLICT (project_id)
				DO
					UPDATE SET data_cache = $2;
				`,
				[projectId, data]
			);
			console.dir({ response });
		} catch (error) {
			console.log(error);
			process.exit(1);
		}

		console.log('task finished');

		console.log(new Date().toISOString());
	},
	{ scheduled: false }
);
