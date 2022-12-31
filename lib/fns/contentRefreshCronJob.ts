import type { ScheduledEvent } from 'aws-lambda';
import axios from 'axios';

const URL = {
	contentRefreshService: 'https://rr583qqx7d.execute-api.us-west-2.amazonaws.com/contentRefreshService',
};

export const handler = async (event?: ScheduledEvent) => {
	const response = await axios.patch(URL.contentRefreshService);
	const data = response.data;
	console.log(response.data);
};