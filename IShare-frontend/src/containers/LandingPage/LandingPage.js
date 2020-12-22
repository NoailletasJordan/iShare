import React from 'react'
import './LandingPage.styles.scss'
import Button from '@material-ui/core/Button'
import { Typography, Box } from '@material-ui/core'
import { Link } from 'react-router-dom'
import ForumIcon from '@material-ui/icons/Forum'

const LandingPage = (props) => {
  return (
    <div className="landing-page">
      <div className="landing-page__container">
        <Typography component="div">
          <h1 className="landing-page__container__title">IShare</h1>
        </Typography>
        <Typography component="div">
          <Box fontSize={20} m={1}>
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </Box>
        </Typography>
        <Box>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              component={Link}
              to="/posts"
              color="primary"
              endIcon={<ForumIcon />}
            >
              access Forum
            </Button>
          </Box>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              component={Link}
              to="/register"
              color="secondary"
              size="small"
            >
              Sign Up
            </Button>
            <Button
              variant="contained"
              component={Link}
              to="/login"
              size="small"
            >
              Login
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  )
}

export default LandingPage
