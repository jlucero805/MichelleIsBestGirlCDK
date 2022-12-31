# Welcome to Infrastructure for michelle-is-best-girl.com

This project defines infrastructure for michelle-is-best-girl.com

## Rest Documentation

### UnreleasedContentManagerService

* Get All Reasons

	GET https://72lbu99o59.execute-api.us-west-2.amazonaws.com/unreleasedContentService

	Response: [
		{
			"pk", "reason", "title"
		}
	]

* Get one reason

	GET https://72lbu99o59.execute-api.us-west-2.amazonaws.com/unreleasedContentService/1

* Replace one reason

	PUT https://72lbu99o59.execute-api.us-west-2.amazonaws.com/unreleasedContentService

	{
		"pk",
		"title",
		"reason"
	}

* Add one reason

	POST https://72lbu99o59.execute-api.us-west-2.amazonaws.com/unreleasedContentService

	{
		"title",
		"reason"
	}

* Delete one reason

	DELETE https://72lbu99o59.execute-api.us-west-2.amazonaws.com/unreleasedContentService

	{
		"pk"
	}

### ContentRefreshService

* Get cached content

	GET https://rr583qqx7d.execute-api.us-west-2.amazonaws.com/

* Update cached content

	PATCH https://rr583qqx7d.execute-api.us-west-2.amazonaws.com/


## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
