Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



# Build a simple CRUD operation & Data streams on Amazon QLDB using AWS Lambda, API Gateway, Amazon DynamoDB, Amazon Kinesis Data streams
Protected Source with compensation liability. Patent pending. Update May 31 2023


## Solution Overview

This demonstrates following Serverless solutions to create a virtual financial wallet solution.

* **[Amazon API gateway](https://aws.amazon.com/api-gateway/)**
* **[AWS Lambda](https://aws.amazon.com/api-gateway/)**
* **[Amazon QLDB](https://aws.amazon.com/qldb/)**
* **[Amazon Kinesis data streams](https://aws.amazon.com/lambda/)**
* **[Amazon DynamoDB](https://aws.amazon.com/dynamodb/)**

## DISCLAIMER: Before you install

* The stack installation deploys in US-EAST-1 of AWS Cloud. Resources will be consumed beyond the FREE-TIER. 
* Cleanup steps are provided below to delete resources that are created by the stack. Refer CLEANUP section
* This is a prototype only for testing and education.
* Deploy and Test at your own risks and no claims can be made to the owner for consumption billing, performances or anything that the stack creates or deletes.
* The application stack ships without any support
* You should have basic understanding of computer programming

## Pre-Requisite Installation

1. Signup for AWS account. Resources will be consumed beyond the FREE-TIER. 
2. Serverless framework relies on node js runtime in your IDE. [Install Node JS](https://nodejs.org/en/download/package-manager/) latest version.

Verify and proceed  when your version verification is complete.

```
$ node -v
v14.17.5
$ npm -v
6.14.14
```

3. Install the latest version of [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html)

Confirm the installation and proceed.

```
`$ aws --version 
aws-cli/2.1.29 Python/3.7.4 Linux/4.14.133-113.105.amzn2.x86_64 botocore/2.0.0`
```



4. Configure your AWS credentials by following [instructions here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).

*Note:The fastest way to get started with Serverless is to create an IAM user with Administrator Access. This IAM user will have full access to your AWS account and ****should not**** be used for your company's production AWS account. The best approach here is to create a new AWS account *[](https://aws.amazon.com/organizations/)*with limited ability to affect other resources. This will give you the widest latitude to experiment with Serverless without getting tangled in a web of IAM permissions.*

`$ aws configure`

configure with AWS Access key and secrey as per the documentation above

`
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]: json`


5. Install AWS SAM by following [instructions here](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

Verify the installation and proceed

```

$ sam --version
SAM CLI, version 1.19.0
```



6. Install git (to download the application stack), Follow [steps here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

Verify the installation and proceed.

```
$ git —version
git version 2.32.0
```



## DEPLOYMENT


**Clone the code repo from github**

1. Create a directory in your local machine 
2. Within the directory run the following command

```
$ git clone 
```

***Note:** if you dont have git installed, please follow the instructions [here](https://github.com/git-guides/install-git)*
Your file tree structure should look like this in the current directory

```
.
├── api
│   ├── capmywallet-qldb.js
│   └── package.json
├── events
│   └── event.json
├── package.json
├── README.md
├── samconfig.toml
├── template.yaml

```



1. Run the following command from the location of “template.yaml”

$ sam build



2. Run the following command from the location of “template.yaml” after the build succeds

$ sam deploy -g —capabilities CAPABILITY_NAMED_IAM




## Verify the deployed services

The above deployment will deploy the following services

### **Verify API end points (sample below)**

```
POST - https://sampleurl.amazonaws.com/Prod/createtable/
GET  - https://sampleurl.amazonaws.com/Prod/index/
POST - https://sampleurl.amazonaws.com/Prod/createaccount/
POST - https://sampleurl.amazonaws.com/Prod/checkfunds/
POST - https://sampleurl.amazonaws.com/Prod/addfunds/
POST - https://sampleurl.amazonaws.com/Prod/withdrawfunds/
```



### Verify Resources

**QLDB Ledger.** 
**Access Amazon QLDB from AWS Management Console→ Change your region (default deploys in us-east-1))**

```
LedgerName: captable1
```


**DynamoDB Table.**
**Access Amazon QLDB from AWS Management Console→ Change your region (default deploys in us-east-1)**

```
TableName: captable1
```


**Kinesis data stream.** 
**Access Amazon Kinesis from AWS Management Console→ Change your region (default deploys in us-east-1)**

```
Data Stream Name: captable1-kinesis-stream
```


**IAM role.**
**Access IAM rom AWS Management Console→ Change your region (default deploys in us-east-1)**

```
QLDB Kinesis Stream role name: captableStream-*accountid**-**region*
Lambda role : capmywallet-west2-1148-funds-*region-*lambdaRole
```


## Test you Data Stream from QLDB

* Sign in to the AWS Management Console, and open the Amazon QLDB console at https://console.aws.amazon.com/qldb.
* In the navigation pane, choose **Streams**.
* Click on “catable1-qldb-stream” 
* Verify the details like Record aggregation, Destination and Analyse the Stream metrics

## Test your CRUD operations (refer to the AWS blog post)

## Cleanup

If you no longer need to use the captable1 ledger after completing your testing, from your directory in the shell run the below command (same directory as “sam deploy” command)

```
$ aws cloudformation delete-stack --region <REGIONDEPLOYED> --stack-name <STACKNAME>
```

THERE WILL BE NO OUTPUT OF THE COMMAND. Alternatively, Yon can log into A*WS Management Console→ Cloudformation* to check the progress of the deletion of the stack


## Conclusion

Hopefully this was informative. If you need help please message private or drop email to the  author
