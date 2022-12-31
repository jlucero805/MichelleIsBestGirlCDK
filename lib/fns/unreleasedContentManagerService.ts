import type { APIGatewayProxyResultV2, APIGatewayProxyEventV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
	DynamoDBDocumentClient,
	ScanCommand,
	PutCommand,
	GetCommand,
	DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = 'reasonsTable';

const paths = {
	v0: '/unreleasedContentService',
	v1: '/unreleasedContentService/1',
};

export const handler = async (
	event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
	const body = event.body
		? JSON.parse(event.body)
		: {};
	const method = event.requestContext.http.method;
	const path = event.rawPath;
	const requestId = event.requestContext.requestId;
	if (method === 'GET') {
		if (path === paths.v1) {
			try {
				const oneItem = await dynamo.send(
					new GetCommand({
						TableName: tableName,
						Key: {
							pk: body.pk,
						},
					})
				);
				return {
					body: JSON.stringify(oneItem.Item),
					statusCode: 200
				};
			} catch (e) {
				return {
					body: JSON.stringify(e),
					statusCode: 500
				}
			}
		} else if (path === paths.v0) {
			const allItems = await dynamo.send(
				new ScanCommand({ TableName: tableName })
			);
			return {
				body: JSON.stringify( allItems.Items),
				statusCode: 200
			};
		}
	} else if (method === 'POST') {
		await dynamo.send(
			new PutCommand({
				TableName: tableName,
				Item: {
					pk: requestId,
					title: body.title,
					reason: body.reason,
				},
			})
		);
		return { statusCode: 200 };
	} else if (method === "PUT") {
		await dynamo.send(
			new PutCommand({
				TableName: tableName,
				Item: {
					pk: body.pk,
					title: body.title,
					reason: body.reason,
				},
			})
		);
		return { statusCode: 200 };
	} else if (method === "DELETE") {
		await dynamo.send(
			new DeleteCommand({
				TableName: tableName,
				Key: {
					pk: body.pk,
				},
			})
		);
		return { statusCode: 200, };
	};

	return {
		body: 'Method Does not exists',
		statusCode: 404,
	}
};