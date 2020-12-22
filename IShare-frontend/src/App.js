import React, { Fragment, useEffect } from 'react'
import './base.styles.scss'
import { Route, Redirect, Switch } from 'react-router-dom'
import Header from './containers/Header/Header'
import LandingPage from './containers/LandingPage/LandingPage'
import DevelopersPage from './containers/DevelopersPage/DevelopersPage'
import ProfilePage from './containers/ProfilePage/ProfilePage'
import RegisterPage from './containers/RegisterPage/RegisterPage'
import LoginPage from './containers/LoginPage/LoginPage'
import Snackbar from './components/Snackbar/Snackbar'
import DashboardPage from './containers/DashboardPage/DashboardPage'
import PostsPage from './containers/PostsPage/PostsPage'
import PostUniquePage from './containers/PostUniquePage/PostUniquePage'
import CreateProfilePage from './containers/CreateProfilePage/CreateProfilePage'
import AddExperiencePage from './containers/AddExperiencePage/AddExperiencePage'
import AddEducationPage from './containers/AddEducationPage/AddEducationPage'

import { ajaxFunction } from './fetch'
import { useSelector, useDispatch } from 'react-redux'
import { userLoad } from './actions/user.js'
import { profileUpdate } from './actions/profile'
import { addGoogleClient } from './actions/google'
import { profileLogout } from './actions/profile'

// fix the margin bottom

function App() {
  const { isLogged, token } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  // auto login
  useEffect(() => {
    const autoLogin = async () => {
      const storedToken = getTokenFromStorage()
      if (!storedToken) return

      const { err, data } = await ajaxFunction(
        'GET',
        '/api/auth',
        null,
        storedToken
      )
      if (err)
        return console.log(err.message + ', you likely wasnt logged before')

      // update redux
      const { name, email, avatar, _id: id, isGoogle } = data
      dispatch(
        userLoad({ name, email, avatar, id, token: storedToken, isGoogle })
      )
    }
    autoLogin()
  }, [])

  // when user log in
  useEffect(() => {
    //not logged
    if (!isLogged) {
      const getGoogleIdKeyFromAPI = async () => {
        const { err, data } = await ajaxFunction(
          'GET',
          '/api/users/google',
          null
        )
        if (err) return console.log(err.message)

        //update redux
        dispatch(addGoogleClient(data.googleClientId))
      }

      //reset profile redux
      dispatch(profileLogout())

      //get google key
      getGoogleIdKeyFromAPI()
      return
    }
    //logged

    // store item in memory
    localStorage.setItem('social-dev-app__token', token)

    //get profile from db
    const getProfileFromDatabase = async () => {
      const { err, data } = await ajaxFunction(
        'GET',
        '/api/profile/me',
        null,
        token
      )
      if (err) return console.log(err.message)

      dispatch(profileUpdate(data))
    }
    getProfileFromDatabase()
  }, [isLogged])

  const getTokenFromStorage = () => {
    const storedToken = localStorage.getItem('social-dev-app__token')
    if (!storedToken || storedToken === undefined || storedToken.trim() === '')
      return false

    return storedToken
  }

  return (
    <div className="container">
      <Header />
      <Snackbar />

      <Switch>
        {isLogged ? loggedRoutes : unloggedRoutes}
        <Redirect to="/developers" />
      </Switch>
    </div>
  )
}

export default App

const loggedRoutes = (
  //logged
  <Fragment>
    <Route exact path="/developers" component={DevelopersPage} />
    <Route exact path="/profile/:id" component={ProfilePage} />
    <Route exact path="/dashboard" component={DashboardPage} />
    <Route exact path="/posts" component={PostsPage} />
    <Route exact path="/post/:postId" component={PostUniquePage} />
    <Route exact path="/create-profile" component={CreateProfilePage} />
    <Route exact path="/add-experience" component={AddExperiencePage} />
    <Route exact path="/add-education" component={AddEducationPage} />
    <Redirect to="/posts" />
  </Fragment>
)

const unloggedRoutes = (
  //not logged
  <Fragment>
    <Route exact path="/" component={LandingPage} />
    <Route exact path="/developers" component={DevelopersPage} />
    <Route exact path="/profile/:id" component={ProfilePage} />
    <Route exact path="/register" component={RegisterPage} />
    <Route exact path="/login" component={LoginPage} />
    <Route exact path="/posts" component={PostsPage} />
    <Route exact path="/post/:postId" component={PostUniquePage} />
    <Route exact path="/create-profile" component={CreateProfilePage} />
    <Route exact path="/add-experience" component={AddExperiencePage} />
    <Route exact path="/add-education" component={AddEducationPage} />
    <Redirect to="/posts" />
  </Fragment>
)
