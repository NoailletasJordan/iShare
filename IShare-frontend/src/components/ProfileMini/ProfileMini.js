import { Paper, Box, Button, Typography, Grid, Chip } from '@material-ui/core'
import React from 'react'
import CheckIcon from '@material-ui/icons/Check'
import { Link } from 'react-router-dom'
import './ProfileMini.styles.scss'

const styles = {
  button: {
    marginTop: 8,
    textTransform: 'capitalize',
  },
}

const ProfileMini = (props) => {
  return (
    <Paper elevation={3}>
      <Grid
        container
        className="profile-mini"
        alignItems="center"
        justify="center"
        style={{ width: '90%' }}
      >
        <Grid
          md={3}
          xs={4}
          item
          container
          justify="center"
          alignItems="center"
          //className="profile-mini__wrapper__image"
        >
          <div
            style={{ backgroundImage: `url('${props.avatar}')` }}
            className="profile-mini__image"
          />
        </Grid>
        <Grid item md={4} xs={8} className="profile-mini__wrapper__infos">
          <Box fontSize="h5.fontSize">{props.name}</Box>
          <Box>
            {`${props.status} `}
            {props.company ? `at ${props.company}` : null}
          </Box>
          <Box fontSize={14}>{props.location}</Box>
          <Button
            variant="contained"
            color="secondary"
            style={styles.button}
            component={Link}
            to={`/profile/${props.user}`}
          >
            View Profile
          </Button>
        </Grid>
        <Grid item md={5}>
          <Typography
            component="ul"
            color="primary"
            className="profile-mini__list"
          >
            {props.skills.map((skill) => (
              <Box
                key={skill}
                mx={1}
                component="li"
                display="flex"
                alignItems="center"
                my={0.5}
              >
                <Chip label={skill} color="primary" />
              </Box>
            ))}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ProfileMini
