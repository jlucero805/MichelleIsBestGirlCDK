import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Architecture } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import {
	Rule,
	Schedule,
} from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

export interface CronLambdaProps {
	disambiguator: string;
	entry: string;
	schedule?: Schedule;
};

export class CronLambda extends Construct {
	readonly function: NodejsFunction;
	readonly rule: Rule;

	constructor (scope: Construct, id: string, props: CronLambdaProps) {
		super(scope, id);

		this.function = new NodejsFunction(this, `NodejsFunction-${props.disambiguator}`, {
			architecture: Architecture.ARM_64,
			entry: props.entry,
			logRetention: RetentionDays.ONE_DAY,
		});

		this.rule = new Rule(this, `NodejsFunctionCronRule-${props.disambiguator}`, {
			schedule: props.schedule
				? props.schedule
				: Schedule.cron({
					minute: '30',
					hour: '0',
				}),
		});

		this.rule.addTarget(new LambdaFunction(this.function));
	}
};