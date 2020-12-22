import React, { useState, useEffect } from 'react'
import './ProfilePage.styles.scss'
import {
  Button,
  makeStyles,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Grid,
  useMediaQuery,
} from '@material-ui/core'
import TwitterIcon from '@material-ui/icons/Twitter'
import FacebookIcon from '@material-ui/icons/Facebook'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import YouTubeIcon from '@material-ui/icons/YouTube'
import InstagramIcon from '@material-ui/icons/Instagram'
import { Link } from 'react-router-dom'
import { ajaxFunction } from '../../fetch'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import WorkIcon from '@material-ui/icons/Work'
import LaptopMacIcon from '@material-ui/icons/LaptopMac'
import ExpertiseSection from '../../components/ExpertiseSection/ExpertiseSection'
import ExperienceSection from '../../components/ExperienceSection/ExperienceSection'
import EducationSection from '../../components/EducationSection/EducationSection'
import GithubSection from '../../components/GithubSection/GithubSection'

const useStyles = makeStyles((theme) => ({
  button: {
    background: '#eee',
  },
  head: {
    background: theme.palette.secondary.main,
    color: 'white',
    padding: '0 0',
    marginTop: '1rem',
  },
  list: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  link: {
    cursor: 'pointer',
    textTransform: 'none',
    color: 'white',
    fontSize: '24px',
    marginRight: '0.8rem',
    '&:link': {
      color: 'white',
    },
    '&:visited': {
      color: 'white',
    },
    '&:active': {
      color: 'white',
    },
    '&:hover': {
      color: 'grey',
    },
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  image: {
    margin: '0 auto 0 auto',

    width: '100%',
    borderRadius: '10px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '&::after': {
      content: '""',
      display: 'block',
      paddingBottom: '100%',
    },
  },
  separator: {
    height: '1px',
    background: 'rgba(200,200,200,0.7)',
    width: '100%',
  },
  gridQuery: {
    background: 'white',
    color: 'black',
    padding: '4rem',
    [theme.breakpoints.down('sm')]: {
      padding: '1rem',
    },
  },
  title: {
    fontSize: '17px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      marginBottom: '8px',
    },
  },
  sizeQuerie: {
    fontSize: '15px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
    },
  },
  sectionTitle: {
    color: theme.palette.secondary.main,
    fontWeight: '700',
    textTransform: 'capitalize',
    fontSize: '18px',
  },
  wordBreak: {
    wordBreak: 'break-word',
  },
}))

const ProfilePage = (props) => {
  const [profileVisited, setProfileVisited] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const getUserProfileFromDatabase = async () => {
      //get user from db
      const { err, data } = await ajaxFunction(
        'GET',
        `/api/profile/user/${props.match.params.id}`,
        false
      )
      if (err) return console.log(err.message) //error

      setProfileVisited(data)

      //success
    }

    getUserProfileFromDatabase().then(() => setIsLoading(false))
  }, [])

  const classes = useStyles()
  const matches = useMediaQuery('(min-width:1100px)')

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const convertDate = (timestampString) => {
    const date = new Date(timestampString)
    const options = matches
      ? { month: 'short', year: 'numeric' }
      : { year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <div className="profile-page">
      <div className="profile-page__inner  u-padding-top-32">
        <Button
          className={classes.button}
          variant="contained"
          component={Link}
          to="/developers"
        >
          Developers list
        </Button>
        <Typography component="div">
          {isLoading ? (
            <Box mt={7} width="100%" display="flex" justifyContent="center">
              <CircularProgress size={80} color="inherit" />
            </Box>
          ) : profileVisited.user ? (
            <Paper className={classes.head} elevation={3}>
              <Grid container>
                <Grid item sm={3} xs={12} className={classes.leftGrid}>
                  <Box p={2}>
                    <Box
                      className={classes.image}
                      style={{
                        backgroundImage: `url('${profileVisited.avatar}')`,
                      }}
                    />
                    <Box className={classes.capitalize} mt={0} fontSize={26}>
                      {profileVisited.name}
                    </Box>
                    <Box mt={0}>{profileVisited.bio}</Box>
                    <Box
                      fontSize={14}
                      display="flex"
                      alignItems="center"
                      mt={2}
                    >
                      <WorkIcon style={{ fontSize: 18 }} /> <Box mr={1} />
                      {profileVisited.status}
                    </Box>
                    <Box
                      fontSize={14}
                      display="flex"
                      alignItems="center"
                      mt={1}
                    >
                      <LocationOnIcon style={{ fontSize: 18 }} /> <Box mr={1} />{' '}
                      {profileVisited.location}
                    </Box>
                    {profileVisited.website ? (
                      <Box
                        fontSize={14}
                        display="flex"
                        alignItems="center"
                        mt={1}
                        className={classes.wordBreak}
                      >
                        <LaptopMacIcon style={{ fontSize: 18 }} />
                        <Box mr={1} /> {profileVisited.website}
                      </Box>
                    ) : null}

                    <Box component="ul" mt="16px" className={classes.list}>
                      {profileVisited.social &&
                      profileVisited.social.twitter ? (
                        <a href={profileVisited.social.twitter}>
                          <TwitterIcon
                            className={classes.link}
                            fontSize="large"
                          />
                        </a>
                      ) : null}

                      {profileVisited.social &&
                      profileVisited.social.twitter ? (
                        <a href={profileVisited.social.twitter}>
                          <FacebookIcon
                            className={classes.link}
                            fontSize="large"
                          />
                        </a>
                      ) : null}

                      {profileVisited.social &&
                      profileVisited.social.linkedin ? (
                        <a href={profileVisited.social.linkedin}>
                          <LinkedInIcon
                            className={classes.link}
                            fontSize="large"
                          />
                        </a>
                      ) : null}

                      {profileVisited.social &&
                      profileVisited.social.youtube ? (
                        <a href={profileVisited.social.youtube}>
                          <YouTubeIcon
                            className={classes.link}
                            fontSize="large"
                          />
                        </a>
                      ) : null}

                      {profileVisited.social &&
                      profileVisited.social.instagram ? (
                        <a href={profileVisited.social.instagram}>
                          <InstagramIcon
                            className={classes.link}
                            fontSize="large"
                          />
                        </a>
                      ) : null}
                    </Box>
                  </Box>
                </Grid>

                <Grid item sm={9} xs={12} className={classes.gridQuery}>
                  <ExpertiseSection
                    profileVisited={profileVisited}
                    classes={classes}
                  />

                  <ExperienceSection
                    profileVisited={profileVisited}
                    classes={classes}
                    convertDate={convertDate}
                    capitalize={capitalize}
                  />

                  <EducationSection
                    profileVisited={profileVisited}
                    classes={classes}
                    convertDate={convertDate}
                    capitalize={capitalize}
                  />

                  <GithubSection
                    profileVisited={profileVisited}
                    classes={classes}
                  />
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Box fontSize="h5.fontSize">
              This User do not have a profile yet
            </Box>
          )}
        </Typography>
      </div>
    </div>
  )
}

export default ProfilePage
