import React, { useState, Fragment } from 'react'
import PersonIcon from '@material-ui/icons/Person'
import { Link } from 'react-router-dom'
import './LoginPage.styles.scss'
import { useSelector, useDispatch } from 'react-redux'
import { openSnackbar } from '../../actions/snackbar'

import { ajaxFunction } from '../../fetch'
import { userLoad } from '../../actions/user'
import GoogleLogin from 'react-google-login'

import {
  Typography,
  Box,
  makeStyles,
  TextField,
  Button,
} from '@material-ui/core'
import validator from 'validator'

const useStyles = makeStyles((theme) => ({
  signUp: {
    color: theme.palette.primary.dark,
    cursor: 'pointer',
  },
}))

const LoginPage = (props) => {
  const dispatch = useDispatch()
  const googleClient = useSelector((state) => state.google.googleClient)

  const [fields, setFields] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState({
    fields: [],
    message: ['', ''],
  })

  const handleChangeInput = (e, specificInput) => {
    setFields({ ...fields, [specificInput]: e.target.value })

    //removing the error of the current field
    const index = ['email', 'password'].findIndex(
      (elt) => elt === specificInput
    )
    const newFields = error.fields.filter((elt) => elt !== index)
    const newMessage = error.message
    newMessage[index] = ''
    setError({
      fields: newFields,
      message: newMessage,
    })
  }

  const handleGoogleRejection = (res) => {
    console.log('error :', res)
    dispatch(openSnackbar(false, 'custom', res))
  }

  const getUserInfoAndUpdateRedux = async (token) => {
    //server - auth and grab user infos
    const { err, data } = await ajaxFunction('GET', '/api/auth', null, token)
    if (err) {
      dispatch(openSnackbar(false, 'login')) //error
      return { cancel: true }
    }

    // update redux
    const { name, email, avatar, _id: id } = data
    dispatch(userLoad({ name, email, avatar, id, token }))
    dispatch(openSnackbar(true, 'custom', 'Welcome'))

    return { cancel: false }
  }

  const handleSubmit = async () => {
    const { error, fieldsNumber, message } = checkInputValidation()
    if (error) return setError({ fields: fieldsNumber, message }) //error textfield

    //server - login and request token
    const requestBody = {
      email: fields.email,
      password: fields.password,
    }
    const { err, data } = await ajaxFunction('POST', '/api/auth', requestBody)

    if (err) {
      return dispatch(openSnackbar(false, 'custom', err.message)) //error
    } else {
      const { token } = data
      //nest because of the name matching : data

      const { cancel } = await getUserInfoAndUpdateRedux(token)
      if (cancel) return

      //back to developers
      props.history.push('/developers')
    }
  }

  const handleConnectGoogleUser = async (res) => {
    console.log('success :', res)
    //will login if exists, sign in if it dont
    //grab token
    const { profileObj } = res
    const requestBody = {
      email: profileObj.email,
      password: profileObj.googleId,
      avatar: profileObj.imageUrl,
      name: profileObj.name,
    }

    const { err, data } = await ajaxFunction(
      'POST',
      '/api/users/google',
      requestBody
    )

    if (err) {
      return dispatch(openSnackbar(false, 'custom', err.message)) //error
    } else {
      const { token } = data
      //nest because of the name matching : data
      const { cancel } = await getUserInfoAndUpdateRedux(token)
      if (cancel) return

      //back to developers
      props.history.push('/developers')
    }
  }

  const checkInputValidation = () => {
    let error = false
    let fieldsNumber = []
    const message = ['', '']

    if (!validator.isEmail(fields.email)) {
      error = true
      fieldsNumber = fieldsNumber.concat(0)
      message[0] = 'Please enter a valid email'
    }

    if (fields.password.length < 6) {
      error = true
      fieldsNumber = fieldsNumber.concat(1)
      message[1] = 'Password too short'
    }

    return {
      error,
      fieldsNumber,
      message,
    }
  }

  const classes = useStyles()

  return (
    <div className="login-page">
      <Typography
        component="div"
        className="login-page__inner u-padding-top-32"
      >
        <Box
          component="h2"
          color="secondary.main"
          fontWeight="500"
          fontSize="h4.fontSize"
          letterSpacing={5}
        >
          Log In
        </Box>

        <Box display="flex" component="h4" fontWeight="500">
          <PersonIcon />
          <Box ml={1}>Log Into Your Account</Box>
        </Box>

        <form action="" noValidate className="u-margin-top-8">
          <TextField
            id="email"
            label="Email"
            name="email"
            variant="filled"
            margin="normal"
            type="email"
            value={fields.email}
            onChange={(e) => handleChangeInput(e, 'email')}
            fullWidth
            error={error.fields.includes(0) ? true : false}
            helperText={error.fields.includes(0) ? error.message[0] : null}
          />
          <TextField
            id="password"
            label="Password"
            name="password"
            variant="filled"
            margin="normal"
            type="password"
            value={fields.password}
            onChange={(e) => handleChangeInput(e, 'password')}
            fullWidth
            error={error.fields.includes(1) ? true : false}
            helperText={error.fields.includes(1) ? error.message[1] : null}
          />

          <Box display="flex" alignItems="center" mt={3}>
            <Button variant="outlined" color="primary" onClick={handleSubmit}>
              Login
            </Button>

            {googleClient ? (
              <Fragment>
                <Box component="p" mx={2}>
                  OR
                </Box>
                <GoogleLogin
                  clientId={googleClient}
                  render={(renderProps) => (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      Connect with google
                    </Button>
                  )}
                  buttonText="Login"
                  onSuccess={handleConnectGoogleUser}
                  onFailure={handleGoogleRejection}
                  cookiePolicy={'single_host_origin'}
                />
              </Fragment>
            ) : null}
          </Box>

          <Box className="u-margin-top-8">
            Don't have an account ?{' '}
            <Link to="/register" className={classes.signUp}>
              Sign Up
            </Link>
          </Box>
        </form>
      </Typography>
    </div>
  )
}

export default LoginPage
