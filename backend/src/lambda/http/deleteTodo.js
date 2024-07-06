import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
/**
 * {
      "id":""
    }
 */
const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())

const todoTable = process.env.TODO_TABLE

export const handler =
  middy()
    .use(httpErrorHandler())
    .use(
      cors({
        credentials: true
      })
    )
    .handler(async (event) => {
      const parsedBody = JSON.parse(event.body)
      console.log("event", parsedBody)
      await dynamoDbDocument.delete({
        Key: {
          id: parsedBody.id
        },
        TableName: todoTable
      })

      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          id: event.id
        })
      }
    })