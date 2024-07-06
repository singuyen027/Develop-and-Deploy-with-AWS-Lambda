import Axios from 'axios'

export async function getTodos(idToken) {
  console.log('Fetching todos')
  const response = await Axios.get(
    `${process.env.REACT_APP_API_ENDPOINT}/todos`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.items
}

export async function createTodo(idToken, newTodo) {
  const response = await Axios.post(
    `${process.env.REACT_APP_API_ENDPOINT}/todos`,
    JSON.stringify(newTodo),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function patchTodo(idToken, updatedTodo) {
  await Axios.patch(
    `${process.env.REACT_APP_API_ENDPOINT}/todos`,
    JSON.stringify(updatedTodo),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteTodo(idToken, id) {
  await Axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/todos`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      },
      data: {
        id
      }
    })
}

export async function getUploadUrl(idToken, id) {
  const response = await Axios.post(
    `${process.env.REACT_APP_API_ENDPOINT}/todos/attachment/${id}`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl, file) {
  await Axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': "image/png"
    }
  })
}
