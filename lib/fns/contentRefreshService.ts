
import type { APIGatewayProxyResultV2, APIGatewayProxyEventV2 } from 'aws-lambda';
import { 
	S3Client,
	GetObjectCommand,
	PutObjectCommand,
} from '@aws-sdk/client-s3';
import axios from 'axios';

const bucketName = 'michelleisbestgirlstack-s3resourcesreasonscachedc-1ub4x3hmzii2f';
const bucketKey = 'cachedContent'; 

const URL = {
	unreleasedContentManagerService: 'https://72lbu99o59.execute-api.us-west-2.amazonaws.com/unreleasedContentService',
};

const client = new S3Client({});

export const handler = async (
	event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
	const body = event.body
		? JSON.parse(event.body)
		: {};
	const method = event.requestContext.http.method;
	if (method === 'GET') {
		try {
			const stringResponse = await getCommand();
			return {
				body: stringResponse,
				statusCode: 200,
			};
		} catch (e) {
			return {
				body: JSON.stringify(e),
				statusCode: 500,
			}
		}
	} else if (method === 'PATCH') {
		try {
			const response = await cronJob();
			return {
				body: JSON.stringify(response),
				statusCode: 200,
			};
		} catch (e) {

			return {
				body: JSON.stringify(e),
				statusCode: 500,
			}
		};
	} else if (method === 'PUT') {
		return {
			body: JSON.stringify(await putCommand(body.content)),
			statusCode: 200,
		}
	};

	return {
		body: 'Method Does not exists',
		statusCode: 404,
	}
};

const putCommand = async (string: string) => {
	const s3Response = await client.send(
		new PutObjectCommand({
			Bucket: bucketName,
			Key: bucketKey,
			Body: string,
		})
	);
	return s3Response;
};

const getCommand = async () => {
	const s3Response = await client.send(
		new GetObjectCommand({
			Bucket: bucketName,
			Key: bucketKey,
		})
	);
	const stringResponse = await s3Response.Body?.transformToString();
	return stringResponse;
}

const cronJob = async () => {
	const data = JSON.parse(await getCommand() as string);
	console.log(data);

	const today = getTodaysDate();
	const todaysDate = new Date(today);
	const latest = data[data.length - 1];
	const latestDate = new Date(latest.date);
	if (todaysDate - latestDate > 0) {
		const randomReason = await popRandomReason();
		randomReason.date = today;
		data.push(randomReason);
		await putCommand(JSON.stringify(data));
	} else {
		return "DONT DO OPERATION";
	};
}; 

const getAllReasons = async () => {
	const response = await axios.get(URL.unreleasedContentManagerService);
	const data = response.data;
	return data;
};

const popRandomReason = async () => {
	const reasons = await getAllReasons();
	const randInt = Math.floor(Math.random() * reasons.length);
	const randomReason = reasons[randInt];
	const deleteResponse = await axios.delete(URL.unreleasedContentManagerService, {
		data: {
			pk: randomReason.pk,
		}
	});
	return randomReason;
}

const getTodaysDate = () => {
	const date = new Date();
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth() + 1;
	const day = date.getUTCDate();
	return `${year}-${month}-${day}`;
};