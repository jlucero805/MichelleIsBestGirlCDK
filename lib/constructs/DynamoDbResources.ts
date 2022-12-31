import { Construct } from 'constructs';
import { 
	Table,
	AttributeType,
	BillingMode,
	TableClass,
} from 'aws-cdk-lib/aws-dynamodb';

export interface DynamoDBResourcesConstructProps {
};

export class DynamoDbResourcesConstruct extends Construct {
	readonly reasonsTable: Table;

	constructor (scope: Construct, id: string, props: DynamoDBResourcesConstructProps) {
		super(scope, id);

		this.reasonsTable = new Table(this, 'table', {
			tableName: 'reasonsTable',
			partitionKey: { name: 'pk', type: AttributeType.STRING },
			billingMode: BillingMode.PAY_PER_REQUEST,
			tableClass: TableClass.STANDARD,
		});
	}
};