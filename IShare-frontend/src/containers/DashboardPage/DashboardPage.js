import React, { useState } from 'react'
import { Typography, Box, makeStyles, Button } from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox'
import BusinessIcon from '@material-ui/icons/Business'
import DashboardCredentialExpGrid from '../../components/DashboardCredentialExpGrid/DashboardCredentialExpGrid'
import DashboardCredentialEduGrid from '../../components/DashboardCreadentialEduGrid/DashboardCreadentialEduGrid'
import BackdropDeleteAccount from '../../components/BackdropDeleteAccount/BackdropDeleteAccount'
import { Link } from 'react-router-dom'
import './DashboardPage.styles.scss'

import { useSelector, useDispatch } from 'react-redux'
import { ajaxFunction } from '../../fetch'
import { openSnackbar } from '../../actions/snackbar'
import { profileUpdate, profileLogout } from '../../actions/profile'
import { userLogout } from '../../actions/user'

const useStyles = makeStyles(theme => ({
  button: {
    textTransform: 'capitalize'
  },
  buttonRoot: {
    color: theme.palette.secondary.main,
    marginRight: '1rem',
    marginBottom: '1rem'
  },
  buttonDelete: {
    background: theme.palette.error.main,
    textTransform: 'capitalize',
    color: 'white',
    '&:hover': {
      background: theme.palette.error.dark
    }
  }
}))

//convert dates
const convertDate = timestampString => {
  const date = new Date(timestampString)
  const options = { month: 'short', year: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

const DashboardPage = props => {
  const dispatch = useDispatch()
  const { token, name } = useSelector(state => state.user)

  // state for the "delete my account" backdrop
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleDeleteExpOrEdu = type => async _id => {
    //type: experience or education

    //send to backend
    const { err, data } = await ajaxFunction(
      'DELETE',
      `/api/profile/${type}/${_id}`,
      false,
      token
    )
    if (err) return dispatch(openSnackbar(false, 'custom', err.message)) //error

    //open snackbar success
    dispatch(
      openSnackbar(
        true,
        'custom',
        type === 'experience' ? `Experience deleted` : `Education deleted`
      )
    )

    //update redux
    dispatch(profileUpdate(data))
  }

  const handleDeleteMyAccount = async () => {
    handleClose()
    // Delete the account -- no need data here
    const { err } = await ajaxFunction('DELETE', '/api/profile/', false, token)

    if (err) {
      return dispatch(openSnackbar(false, 'custom', err.message)) //error
    }
    //inform user
    dispatch(
      openSnackbar(true, 'custom', 'Your account has been successfuly removed')
    )

    //update redux
    dispatch(userLogout())
    dispatch(profileLogout())
  }

  const classes = useStyles()
  return (
    <Typography component="div" className="dashboard-page">
      <div className="dashboard-page__inner u-padding-top-32">
        <Box
          component="h2"
          color="secondary.main"
          fontWeight="500"
          fontSize="h4.fontSize"
          letterSpacing={5}
        >
          Dashboard
        </Box>
        <Box
          component="h4"
          fontWeight="500"
          className="dashboard-page__subtitle"
        >
          <PersonIcon />
          Welcome {name}
        </Box>

        <div className="dashboard-page__buttons-row u-margin-top-8">
          <Button
            disableElevation
            variant="contained"
            className={classes.button}
            component={Link}
            to="/create-profile"
            classes={{ root: classes.buttonRoot }}
          >
            <AccountCircleIcon fontSize="small" />
            <Box ml={1}>Create/Edit Profile</Box>
          </Button>

          <Button
            disableElevation
            variant="contained"
            component={Link}
            to="/add-experience"
            className={classes.button}
            classes={{ root: classes.buttonRoot }}
          >
            <BusinessIcon fontSize="small" />
            <Box ml={1}>Add Experience</Box>
          </Button>

          <Button
            disableElevation
            variant="contained"
            className={classes.button}
            component={Link}
            to="/add-education"
            ml={1}
            classes={{ root: classes.buttonRoot }}
          >
            <BusinessCenterIcon fontSize="small" />
            <Box ml={1}>Add Education</Box>
          </Button>
        </div>

        <Box
          component="h4"
          fontWeight="500"
          className="dashboard-page__subtitle u-margin-top-24"
        >
          Experience Credentials
        </Box>

        <DashboardCredentialExpGrid
          convertDate={convertDate}
          handleDeleteExperience={handleDeleteExpOrEdu('experience')}
        />

        <Box
          component="h4"
          fontWeight="500"
          className="dashboard-page__subtitle u-margin-top-16"
        >
          Education Credentials
        </Box>

        <DashboardCredentialEduGrid
          convertDate={convertDate}
          handleDeleteEducation={handleDeleteExpOrEdu('education')}
        />

        <div className="u-margin-top-24">
          <Button
            variant="contained"
            onClick={handleClickOpen}
            className={classes.buttonDelete}
          >
            <IndeterminateCheckBoxIcon fontSize="small" />
            <Box ml={1}>Delete My Account</Box>
          </Button>
        </div>
        <BackdropDeleteAccount
          open={open}
          handleClose={handleClose}
          handleClickOpen={handleClickOpen}
          handleDeleteMyAccount={handleDeleteMyAccount}
        />
      </div>
    </Typography>
  )
}

export default DashboardPage
