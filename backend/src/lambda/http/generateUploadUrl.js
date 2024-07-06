import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import middy from '@middy/core'
import cors from '@middy/http-cors'
import { v4 as uuidv4 } from 'uuid'
import httpErrorHandler from '@middy/http-error-handler'
const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())


const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
export const handler =
  middy()
    .use(httpErrorHandler())
    .use(
      cors({
        credentials: true
      })
    )
    .handler(async (event) => {
      
      console.log("event.pathParameters", event.pathParameters)
      console.log("event", event)
      if (!event.pathParameters.todoId) {
        return {
          "statusCode": 201,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          "body": "VCL u need todoId in url"
        }
      }
      
      const imageId = uuidv4()
      const uploadUrl = await getUploadUrl(imageId)
      console.log('event.body :>> ', event.body);
      await createImage(event.pathParameters.todoId, imageId, event.body)
      return {
        "statusCode": 201,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        "body": JSON.stringify({
          uploadUrl
        })
      }
    })

async function createImage(id,imageId, body) {
  const timestamp = new Date().toISOString()
  let valueDetail;
  await dynamoDbDocument.query({
    TableName: process.env.TODO_TABLE,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id
    }
  }).then(val => {
    valueDetail = val.Items[0]
  })

  const newItem = {
    timestamp,
    id,
    ...valueDetail,
    // New field that we store
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`,
  }
  console.log('Dynamo new item: ', newItem)
  await dynamoDbDocument.put({
    TableName: process.env.TODO_TABLE,
    Item: newItem,
  })
}

async function getUploadUrl(imageId) {
  const XAWS = AWSXRay.captureAWS(AWS);
  const s3 = new XAWS.S3({ signatureVersion: 'v4' });

  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
});
}