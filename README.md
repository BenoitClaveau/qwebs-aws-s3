# qwebs-aws-s3
[AWS S3](https://aws.amazon.com/s3/) service for [Qwebs server](https://www.npmjs.com/package/qwebs).

 [![NPM][npm-image]][npm-url]
 [![Build Status][travis-image]][travis-url]
 [![Coverage Status][coveralls-image]][coveralls-url]

## Features

  * [Qwebs](https://www.npmjs.com/package/qwebs)
  * [AWS S3 API](http://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)


## AWS S3

```config.json
{
    "aws": {
        "s3": {
            "apiVersion": "2006-03-01", 
            "signatureVersion": "v4",
            "bucket": "<your bucket name>",
            "host": "https://s3.ap-northeast-2.amazonaws.com",
            "endpoint": "https://<api id>.execute-api.eu-central-1.amazonaws.com"
        }
    }
}
```
### Declare and inject AWS S3 service

```routes.json
{
  "services": [
    { "name": "$aws-s3", "location": "qwebs-aws-s3" }
  ]
}
```

## Installation

```bash
$ npm install qwebs-aws-s3
```

## Test

To run our tests, clone the qwebs-aws-s3 repo and install the dependencies.

```bash
$ git clone https://github.com/BenoitClaveau/qwebs-aws-s3 --depth 1
$ cd qwebs-aws-s3
$ npm install
$ node.exe "..\node_modules\jasmine-node\bin\jasmine-node" --verbose tests
```

[npm-image]: https://img.shields.io/npm/v/qwebs-aws-s3.svg
[npm-url]: https://npmjs.org/package/qwebs-aws-s3
[travis-image]: https://travis-ci.org/BenoitClaveau/qwebs-aws-s3.svg?branch=master
[travis-url]: https://travis-ci.org/BenoitClaveau/qwebs-aws-s3
[coveralls-image]: https://coveralls.io/repos/BenoitClaveau/qwebs-aws-s3/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/BenoitClaveau/qwebs-aws-s3?branch=master
