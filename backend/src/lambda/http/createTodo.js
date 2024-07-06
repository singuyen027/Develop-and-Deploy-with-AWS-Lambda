import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import { handler as getUserId } from '../auth/userId.js'
import httpErrorHandler from '@middy/http-error-handler'
/**
 * {
      "userId":"google-oauth2|115783759495544745774",
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
      const itemId = uuidv4()
      const parsedBody = JSON.parse(event.body)
      console.log("creatret Todo function, parsedBody", parsedBody)

      // Extracting user ID using "getUserId"
      const authorization = event.headers.Authorization
      const userId = getUserId(authorization)
      console.log("userId", userId)
      const newItem = {
        ...parsedBody,
        id: itemId,
        userId
      }

      await dynamoDbDocument.put({
        TableName: todoTable,
        Item: newItem
      })

      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          newItem
        })
      }
    })


// function getUserId(authorizationHeader) {

//   const split = authorizationHeader.split(' ')
//   const jwtToken = split[1]

//   const decodedJwt = jsonwebtoken.decode(jwtToken)
//   console.log("decodedJwt.sub", decodedJwt.sub)
//   return decodedJwt.sub
// }