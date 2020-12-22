export const ajaxFunction = async (method, link, body, token) => {
  const obj = {
    method,
    headers: {
      //IMPORTANT
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
  }
  if (body) obj.body = JSON.stringify(body)
  try {
    const resBrut = await fetch(
      `https://ishare-backend.herokuapp.com${link}`,
      obj
    )
    const res = await resBrut.json()
    if (resBrut.status >= 200 && resBrut.status < 300) {
      //success response
      return {
        err: false,
        data: res,
      }
    } else {
      //failed response
      let error = new Error('error')
      error.status = resBrut.status
      error.message = res.errors[0].msg

      throw error
    }
  } catch (e) {
    console.log('error message:', e.message)
    console.log('error status:', e.status)
    return {
      err: e,
      data: null,
    }
  }
}
