import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Architecture } from 'aws-cdk-lib/aws-lambda';
import {
	CorsHttpMethod,
	HttpApi,
	HttpMethod,
 } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

export interface RestLambdaProps {
	disambiguator: string;
	entry: string;
	routes: string[];
};

export class RestLambda extends Construct {
	readonly function: NodejsFunction;
	readonly httpApi: HttpApi;
	readonly integration: HttpLambdaIntegration;

	constructor (scope: Construct, id: string, props: RestLambdaProps) {
		super(scope, id);

		this.function = new NodejsFunction(this, `NodejsFunction-${props.disambiguator}`, {
			architecture: Architecture.ARM_64,
			entry: props.entry,
			logRetention: RetentionDays.ONE_DAY,
		});

		this.httpApi = new HttpApi(this, `HttpApi-${props.disambiguator}`, {
			corsPreflight: {
				allowHeaders: ['Content-Type'],
				allowMethods: [CorsHttpMethod.ANY],
				allowOrigins: ['*'],
			},
		});

		this.integration = new HttpLambdaIntegration(`HttpLambdaIntegration-${props.disambiguator}`,
			this.function);

		props.routes.forEach(route => {
			this.httpApi.addRoutes({
				integration: this.integration,
				methods: [HttpMethod.ANY],
				path: route,
			});
		});
	}
};