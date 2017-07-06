/*!
 * qwebs-aws-api-gateway
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
'use strict';

let DataError = require('qwebs').DataError;
let AWS = require('aws-sdk');
let path = require('path');
let Mustache = require('mustache');

function AwsS3Service($config) {
    if (!$config) throw new DataError({ message: "$config is not defined." });
    if (!$config.aws) throw new DataError({ message: "AWS config is not defined." });
    if (!$config.aws.s3) throw new DataError({ message: "AWS S3 config is not defined." });
    if (!$config.aws.s3.apiVersion) throw new DataError({ message: "AWS S3 api version is not defined." });
    if (!$config.aws.s3.signatureVersion) throw new DataError({ message: "AWS S3 signature version is not defined." });
    
    this.$config = $config;
    this.s3 = new AWS.S3({ 
        apiVersion: $config.aws.s3.apiVersion, 
        signatureVersion: $config.aws.s3.signatureVersion
    });
}

AwsS3Service.prototype.signedUrl = function(method, options) {
    options = options || {};
    return Promise.resolve().then(() => {
      if (!options.Key) throw new DataError({ message: "Key is not defined." });
        options.Bucket = options.Bucket || this.$config.aws.s3.bucket;
        options.Expires = options.Expires || 5 * 60;
        options.ContentType = options.ContentType || 'application/octet-stream';
        
        return this.s3.getSignedUrl(method, options);
    });
};

AwsS3Service.prototype.headObject = function(options) {
  options = options || {};
  return Promise.resolve().then(() => {
      if (!options.Key) throw new DataError({ message: "Key is not defined." });
      options.Bucket = options.Bucket || this.$config.aws.s3.bucket;
      if (!options.Bucket) throw new DataError({ message: "AWS S3 bucket is not defined." });
      return this.s3.headObject(options).promise();
  });
};

AwsS3Service.prototype.upload = function(options) {
  options = options || {};
  return Promise.resolve().then(() => {
      if (!options.Key) throw new DataError({ message: "Key is not defined." });
      if (!options.Body) throw new DataError({ message: "Body is not defined." });
      options.Bucket = options.Bucket || this.$config.aws.s3.bucket;
      if (!options.Bucket) throw new DataError({ message: "AWS S3 bucket is not defined." });

      options.ACL = options.ACL || 'public-read'

      let json = options.json;
      if (options.json !== undefined) delete options.json;

      let ext = path.extname(options.Key);
      if (/^\.json$/ig.test(ext)) json = true;

      if (json) options.Body = JSON.stringify(options.Body);

      return this.s3.upload(options).promise();
  });
};

AwsS3Service.prototype.putObject = function(options) {
  options = options || {};
  return Promise.resolve().then(() => {
      if (!options.Key) throw new DataError({ message: "Key is not defined." });
      if (!options.Body) throw new DataError({ message: "Body is not defined." });
      if (this.$config.aws.s3.mock) return; //for unit testing
      
      options.Bucket = options.Bucket || this.$config.aws.s3.bucket;
      if (!options.Bucket) throw new DataError({ message: "AWS S3 bucket is not defined." });

      options.ACL = options.ACL || 'public-read'; //????

      let json = options.json;
      if (options.json !== undefined) delete options.json;

      let ext = path.extname(options.Key);
      if (/^\.json$/ig.test(ext)) json = true;

      if (json) options.Body = JSON.stringify(options.Body);

      //if (options.public) options.GrantRead = 'uri="http://acs.amazonaws.com/groups/global/AllUsers"';
      return this.s3.putObject(options).promise();
  });
};

AwsS3Service.prototype.getObject = function(options) {
  options = options || {};
  return Promise.resolve().then(() => {
    if (!options.Key) throw new DataError({ message: "Key is not defined." });
    options.Bucket = options.Bucket || this.$config.aws.s3.bucket;
    if (!options.Bucket) throw new DataError({ message: "AWS S3 bucket is not defined." });

    let json = options.json;
    if (options.json !== undefined) delete options.json;

    let ext = path.extname(options.Key);
    if (/^\.json$/ig.test(ext)) json = true;

    return this.s3.getObject(options).promise().then(data => {
      if (/^application\/json$/g.test(data.ContentType)) return JSON.parse(data.Body);
      if (json) return JSON.parse(data.Body);
      return data.Body;
    });
  });
};

AwsS3Service.prototype.deleteObject = function (options) {
  options = options || {};
  return Promise.resolve().then(() => {
    if (!options.Key) throw new DataError({ message: "Key is not defined." });
    options.Bucket = options.Bucket || this.$config.aws.s3.bucket;
    if (!options.Bucket) throw new DataError({ message: "AWS S3 bucket is not defined." });
    return this.s3.deleteObject(options).promise();
  });
};

AwsS3Service.prototype.listObjects = function(options) {
  options = options || {};
  return Promise.resolve().then(() => {
    options.Bucket = options.Bucket || this.$config.aws.s3.bucket;
    if (!options.Bucket) throw new DataError({ message: "AWS S3 bucket is not defined." });
    options.Delimiter = options.Delimiter || "/";
    options.EncodingType = options.EncodingType || "url";

    return this.s3.listObjects(options).promise().then(bucket => {
      return bucket.Contents;
    });
  });
};

AwsS3Service.prototype.render = function(key, object) {
    return Promise.resolve().then(() => {
        if (!key) throw new DataError({ message: "Key is not defined." });
        if (!object) throw new DataError({ message: "Object is not defined." });
    
        return awsS3Service.getObject({ Key: this.path + key });
    }).then(html => {
        return Mustache.render(html.toString(), object);
    });
};

exports = module.exports = new AwsS3Service();