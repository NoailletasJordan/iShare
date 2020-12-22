import React from 'react'
import { Box, makeStyles, Button, Paper, Grid } from '@material-ui/core'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { withRouter, Link } from 'react-router-dom'

//provide Boolean(author)

const useStyles = makeStyles(theme => ({
  post: {
    minHeight: '150px',
    padding: '16px 16px 16px 0',
    display: 'flex',
    alignContent: 'stretch',
    [theme.breakpoints.down('xs')]: {
      padding: '16px 8px'
    }
  },
  imageContainer: {
    gridRow: '1 / -1'
  },
  image: {
    height: '80px',
    width: '80px',
    borderRadius: '50%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  buttonLine: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,max-content)',
    alignItems: 'center',
    gridColumnGap: '8px'
  },
  buttonDelete: {
    background: theme.palette.error.light,
    textTransform: 'capitalize',
    color: 'white',
    '&:hover': {
      background: theme.palette.error.main
    }
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}))

const Comment = props => {
  const handleRedirectToUserProfile = userId =>
    props.history.push(`/profile/${userId}`)

  //convert dates
  const convertDate = timestampString => {
    const date = new Date(timestampString)
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }
    return date.toLocaleDateString('fr-FR', options).replace('à', '-')
  }

  const classes = useStyles()
  return (
    <Paper className={classes.post} elevation={3}>
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
            <Box component="p" color="secondary.main">
              <Link to={`/profile/${props.user}`} className={classes.link}>
                {props.name}
              </Link>
            </Box>
          </Box>
        </Grid>

        <Grid
          item
          md={10}
          sm={9}
          xs={8}
          container
          direction="column"
          justify="space-between"
        >
          <Box
            style={{ whiteSpace: 'pre-wrap' }}
            maxHeight="1000px"
            overflow="auto"
          >
            {props.text}
          </Box>

          <Box mt={1}>
            <Box fontSize="14px" color="#bbb">
              {`posted on ${convertDate(props.date)}`}
            </Box>

            {props.author ? (
              <Box mt={1} className={classes.buttonLine}>
                <Button
                  variant="contained"
                  onClick={() => props.handleDeleteComment(props._id)}
                  className={classes.buttonDelete}
                >
                  <DeleteForeverIcon />
                </Button>
              </Box>
            ) : null}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default withRouter(Comment)
