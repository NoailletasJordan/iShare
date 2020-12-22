import React from 'react'
import { Box, makeStyles, Paper, Grid } from '@material-ui/core'
import { Link, withRouter } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  post: {
    minHeight: '175px',
    padding: '16px 16px 16px 0',
    [theme.breakpoints.down('xs')]: {
      padding: '16px 8px',
    },
  },

  image: {
    height: '80px',
    width: '80px',
    borderRadius: '50%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  buttonLine: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,max-content)',
    alignItems: 'center',
    gridColumnGap: '8px',
  },
  buttonDiscussion: {
    backgroundColor: theme.palette.info.main,
    textTransform: 'capitalize',
    '&:hover': {
      backgroundColor: theme.palette.info.dark,
    },
  },
  buttonDelete: {
    background: theme.palette.error.light,
    textTransform: 'capitalize',
    color: 'white',
    '&:hover': {
      background: theme.palette.error.main,
    },
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}))

const PostUniqueCurrent = (props) => {
  const classes = useStyles()
  const handleRedirectToUserProfile = (userId) =>
    props.history.push(`/profile/${userId}`)
  return (
    <Paper className={classes.post} elevation={5}>
      <Grid container justify="space-between">
        <Grid item md={2} sm={3} xs={4}>
          <Box
            className={classes.imageContainer}
            display="flex"
            alignItems="center"
            flexDirection="column"
            mt="12px"
          >
            <div
              className={classes.image}
              onClick={() => handleRedirectToUserProfile(props.user)}
              style={{ backgroundImage: `url(${props.avatar})` }}
            />
            <Box component="p" mt={0.5} color="secondary.main">
              <Link to={`/profile/${props.user}`} className={classes.link}>
                {props.name}
              </Link>
            </Box>
          </Box>
        </Grid>

        <Grid item md={10} sm={9} xs={8}>
          <Box mb={1} component={'h3'} color="#424242">
            {props.title}
          </Box>
          <Box
            style={{ whiteSpace: 'pre-wrap', overflowY: 'auto' }}
            maxHeight="1500px"
          >
            {props.text}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default withRouter(PostUniqueCurrent)
