import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import { handler as getUserId } from '../auth/userId.js'
import httpErrorHandler from '@middy/http-error-handler'
/**
 * {
      "id":"",
      "attachmentUrl":"https://serverless-c4-todo-images.s3.amazonaws.com/605525c4-1234-4d23-b3ff-65b853344123",
      "dueDate":"2022-12-12",
      "createdAt":"2022-11-28T22:04:08.613Z",
      "name":"Buy bread",
      "done":false
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
      console.log("parsedBody", parsedBody)
      const authorization = event.headers.Authorization
      const userId = getUserId(authorization)
      console.log("userId", userId)
      await dynamoDbDocument.put({
        TableName: todoTable,
        Item: {
          ...parsedBody
        },
      })

      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          parsedBody
        })
      }
    })