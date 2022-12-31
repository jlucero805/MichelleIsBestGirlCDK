import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';
import { RestLambda } from './constructs/RestLambda';
import { DynamoDbResourcesConstruct } from './constructs/DynamoDbResources';
import { S3Resources } from './constructs/S3Resources';
import { CronLambda } from './constructs/CronLambda';
import { Schedule } from 'aws-cdk-lib/aws-events';

export class MichelleIsBestGirlStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

	const dynamoDb = new DynamoDbResourcesConstruct(this, 'DynamoDbResources', {});
	const s3 = new S3Resources(this, 'S3Resources', {});

	// Unreleased Content Manager Service - Rest Lambda
	const unreleasedContentManagerService = new RestLambda(this, 'UnreleasedContentManagerServiceRestLambda', {
		disambiguator: 'UnreleasedContentManagerServiceRestLambda',
		entry: `${__dirname}/fns/unreleasedContentManagerService.ts`,
		routes: [
			'/unreleasedContentService',
			'/unreleasedContentService/1',
		],
	});

	dynamoDb.reasonsTable.grantReadWriteData(unreleasedContentManagerService.function);

	// Content Refresh Service - Rest Lambda
	const contentRefreshService = new RestLambda(this, 'ContentRefreshService', {
		disambiguator: 'ContentRefreshService',
		entry: `${__dirname}/fns/contentRefreshService.ts`,
		routes: ['/contentRefreshService'],
	});

	s3.reasonsCachedContentBucket.grantReadWrite(contentRefreshService.function);

	// Content Refresh Service - Cron Lambda
	const contentRefreshCronJob = new CronLambda(this, 'ContentRefreshCronJob', {
		disambiguator: 'ContentRefreshCronJob',
		entry: `${__dirname}/fns/contentRefreshCronJob.ts`,
		schedule: Schedule.rate(Duration.minutes(30)),
	});
  }
}
