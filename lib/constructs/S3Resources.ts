import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export interface S3ResourcesProps {
};

export class S3Resources extends Construct {
	readonly reasonsCachedContentBucket: Bucket;

	constructor (scope: Construct, id: string, props: S3ResourcesProps) {
		super(scope, id);

		this.reasonsCachedContentBucket = new Bucket(this, 'ReasonsCachedContentBucket', {});
	}
};