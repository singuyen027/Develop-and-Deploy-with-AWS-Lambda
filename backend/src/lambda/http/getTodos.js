import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import { handler as getUserId } from '../auth/userId.js'
import httpErrorHandler from '@middy/http-error-handler'
const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())

// 'Content-Type': 'application/json',
// Authorization:Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im42SDhiMTJMV1BRSDNvTUMwbXZnUCJ9.eyJuaWNrbmFtZSI6InNvaXNhdHRodTAwMyIsIm5hbWUiOiJzb2lzYXR0aHUwMDNAZ21haWwuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyL2EzNWQwNDBhOTIyN2M0Y2VlNjFiN2I0NjBmYTBjZGUzP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGc28ucG5nIiwidXBkYXRlZF9hdCI6IjIwMjQtMDQtMTVUMTQ6MDc6NTEuMTA3WiIsImVtYWlsIjoic29pc2F0dGh1MDAzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2Rldi10YTN4ZXE4Z255a2M2em8yLnVzLmF1dGgwLmNvbS8iLCJhdWQiOiIyQXRMYzlPM0RnR2JMV3E2dW9qM01wSlJpTVFuMVFKQyIsImlhdCI6MTcxMzI3NDM0NSwiZXhwIjoxNzEzMzEwMzQ1LCJzdWIiOiJhdXRoMHw2NjFhNThiNDg0MTE2YzcxODAwNDBmYWIiLCJzaWQiOiJSZ0JVVW1BMjc0YmRrbnU3bVdNUS1YVjlSNTRfN1h5TiIsIm5vbmNlIjoiYWxNNFJGOXBiVFpRZDFCc1ZYazBkUzF5TkVkRFgzQmxObEZ2UXpaa1VFVTFWa2hSTVZSTldsWTRadz09In0.AUdo-xZ9yaTUOAQ45QWmrpDlxVo7vNusMjDoxgYjqATKU4xhZbYzjsKbWSF8W4biQ_7BZ1fIrray7ogve0Sd4iV5ZUNB-IjkPUD9h5h2X_VqXYxC9rO1myHP4yVhU615ZfsNKR38mQoU8Kf1ryNWiifN7S2piOxcJ_2dNxOAwEhHh2G98WaiHdtHAZHCiwaZfLpVU2m5NFYLs156kfBu9PKkUMm0_PVlx-TLBIBGIfSHlKguf6scWDlLtMkzCMXqm_JTtZKaYX3JIrxn5Xhk_NQSCOOq14ruHQI2C_moG-ANKyDjGJ6EPfA8Ej-6LYtJZJv6E0HFfwoukDzbpBVkzA

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
      const authorization = event.headers.Authorization
      const userId = getUserId(authorization)
      console.log("userId", userId)

      const result = await dynamoDbDocument.scan({
        TableName: todoTable,
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      console.log("result", result)
      return {
        "statusCode": 200,
        "body": JSON.stringify({
          items: result.Items
        })
      }
    })

// }