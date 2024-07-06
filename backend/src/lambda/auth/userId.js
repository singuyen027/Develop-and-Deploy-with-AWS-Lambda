import jsonwebtoken from 'jsonwebtoken'

export function handler(authorizationHeader) {

    const split = authorizationHeader.split(' ')
    const jwtToken = split[1]
    console.log("split", authorizationHeader.split(' '))
    console.log("jwtToken", jwtToken)
    const decodedJwt = jsonwebtoken.decode(jwtToken)
    console.log("decodedJwt.sub", decodedJwt.sub)
    return decodedJwt.sub
  }