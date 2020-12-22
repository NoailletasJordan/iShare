import React, { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  makeStyles,
  TextField,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  FormHelperText
} from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import TwitterIcon from '@material-ui/icons/Twitter'
import FacebookIcon from '@material-ui/icons/Facebook'
import InstagramIcon from '@material-ui/icons/Instagram'
import YouTubeIcon from '@material-ui/icons/YouTube'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import { useSelector, useDispatch } from 'react-redux'
import { ajaxFunction } from '../../fetch'
import { openSnackbar } from '../../actions/snackbar'
import { profileUpdate } from '../../actions/profile'

const useStyles = makeStyles(theme => ({
  createProfilePage: {
    display: 'flex',
    justifyContent: 'center'
  },
  subtitle: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,max-content)',
    gridColumnGap: '8px'
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 32%)',
    justifyContent: 'space-between',
    gridRowGap: '24px',
    marginTop: ' 24px',
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(2, 48%)'
    }
  },
  bio: {
    gridColumn: '1/ -1'
  },
  socialLinks: {
    display: 'grid',
    gridRowGap: '16px'
  }
}))

const CreateProfilePage = props => {
  const dispatch = useDispatch()
  const { token } = useSelector(state => state.user)
  const reduxProfile = useSelector(state => state.profile)
  const [fields, setFields] = useState({
    status: '',
    company: '',
    website: '',
    location: '',
    skills: [],
    githubUsername: '',
    bio: '',
    social: {
      twitter: '',
      facebook: '',
      youtube: '',
      linkedin: '',
      instagram: ''
    }
  })

  useEffect(() => {
    setFields({
      status: reduxProfile.status,
      company: reduxProfile.company,
      website: reduxProfile.website,
      location: reduxProfile.location,
      skills: reduxProfile.skills,
      githubUsername: reduxProfile.githubUsername,
      bio: reduxProfile.bio,
      social: {
        twitter: reduxProfile.social ? reduxProfile.social.twitter : '',
        facebook: reduxProfile.social ? reduxProfile.social.facebook : '',
        youtube: reduxProfile.social ? reduxProfile.social.youtube : '',
        linkedin: reduxProfile.social ? reduxProfile.social.linkedin : '',
        instagram: reduxProfile.social ? reduxProfile.social.instagram : ''
      }
    })
  }, [reduxProfile])

  const [error, setError] = useState({
    fields: [],
    message: ['', '', '', '', '', '', '']
  })

  const checkInputValidation = () => {
    let error = false
    let fieldsNumber = []
    const message = ['', '']

    if (fields.status.length < 1) {
      error = true
      fieldsNumber = fieldsNumber.concat(0)
      message[0] = 'Status required'
    }

    if (!(Array.isArray(fields.skills) && fields.skills.length)) {
      //array empty
      error = true
      fieldsNumber = fieldsNumber.concat(4)
      message[4] = 'At least a Skill required'
    }

    return {
      error,
      fieldsNumber,
      message
    }
  }

  const [socialsIsOpen, setSocialsIsOpen] = useState(false)

  const handleToggleSocials = () => setSocialsIsOpen(!socialsIsOpen)

  const handleChange = (e, specificInput) => {
    setFields({ ...fields, [specificInput]: e.target.value })

    //removing the error of the current field
    const index = [
      'status',
      'company',
      'website',
      'location',
      'skills',
      'githubUsername',
      'bio'
    ].findIndex(elt => elt === specificInput)
    const newFields = error.fields.filter(elt => elt !== index)
    const newMessage = error.message
    newMessage[index] = ''
    setError({
      fields: newFields,
      message: newMessage
    })
  }

  const handleChangeSocial = (e, specificInput) => {
    const newSocial = { ...fields.social }
    newSocial[specificInput] = e.target.value
    setFields({ ...fields, social: newSocial })
  }

  const capitalize = s => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  const setUpTheObjToSend = () => {
    let objToSend = {
      ...fields,
      location: capitalize(fields.location),
      company: capitalize(fields.company),
      bio: capitalize(fields.bio),
      skills: fields.skills.join(',')
    }

    objToSend = {
      ...objToSend,
      ...fields.social,
      githubusername: fields.githubUsername
    }
    delete objToSend.social
    delete objToSend.githubUsername

    return objToSend
  }

  const handleSubmit = async () => {
    const { error, fieldsNumber, message } = checkInputValidation()
    if (error) return setError({ fields: fieldsNumber, message }) //error

    //set up the obj to send
    const requestBody = setUpTheObjToSend()

    //send to backend
    const { err, data } = await ajaxFunction(
      'POST',
      '/api/profile',
      requestBody,
      token
    )
    if (err) return dispatch(openSnackbar(false, 'profile')) //error

    //open snackbar success
    dispatch(openSnackbar(true, 'profile'))

    //update redux
    dispatch(profileUpdate(data))
  }

  const classes = useStyles()
  return (
    <Typography component="div" className={classes.createProfilePage}>
      <Box width="80vw" maxWidth="1300px" mt={3}>
        <Box
          component="h2"
          color="secondary.main"
          fontWeight="500"
          fontSize="h4.fontSize"
          letterSpacing={5}
        >
          Edit Your Profile
        </Box>

        <Box component="h4" fontWeight="500" className={classes.subtitle}>
          <PersonIcon />
          Let's get some informations to make your profile stand out
        </Box>

        <form className={classes.form}>
          <FormControl
            variant="filled"
            error={error.fields.includes(0) ? true : false}
          >
            <InputLabel id="demo-simple-select-filled-label">
              Professional Status *
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              required
              value={fields.status}
              onChange={e => handleChange(e, 'status')}
            >
              <MenuItem value={'Developer'}>Developer</MenuItem>
              <MenuItem value={'Junior developer'}>Junior developer</MenuItem>
              <MenuItem value={'Senior developer'}>Senior developer</MenuItem>
              <MenuItem value={'Manager'}>Manager</MenuItem>
              <MenuItem value={'Student'}>Student or Learning</MenuItem>
              <MenuItem value={'Instructor'}>Instructor</MenuItem>
              <MenuItem value={'Intern'}>Intern</MenuItem>
              <MenuItem value={'Other'}>Other</MenuItem>
            </Select>
            <FormHelperText>
              {error.fields.includes(0) ? error.message[0] : null}
            </FormHelperText>
          </FormControl>

          <TextField
            id="standard-basic"
            label="Company"
            variant="filled"
            value={fields.company}
            onChange={e => handleChange(e, 'company')}
          />

          <TextField
            id="standard-basic"
            label="Website"
            variant="filled"
            value={fields.website}
            onChange={e => handleChange(e, 'website')}
          />

          <TextField
            id="standard-basic"
            label="Location"
            variant="filled"
            value={fields.location}
            onChange={e => handleChange(e, 'location')}
            helperText={'ex: Paris, France'}
          />

          <FormControl
            variant="filled"
            error={error.fields.includes(4) ? true : false}
          >
            <InputLabel id="demo-simple-select-filled-label">
              Skills *
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              multiple
              value={fields.skills}
              onChange={e => handleChange(e, 'skills')}
            >
              <MenuItem value={'JavaScript'}>JavaScript</MenuItem>
              <MenuItem value={'HTML/CSS'}>HTML/CSS</MenuItem>
              <MenuItem value={'SQL'}>SQL</MenuItem>
              <MenuItem value={'NoSQL'}>NoSQL</MenuItem>
              <MenuItem value={'Python'}>Python</MenuItem>
              <MenuItem value={'Java'}>Java</MenuItem>
              <MenuItem value={'Node'}>Node</MenuItem>
              <MenuItem value={'React'}>React</MenuItem>
              <MenuItem value={'C'}>C</MenuItem>
              <MenuItem value={'C#'}>C#</MenuItem>
              <MenuItem value={'C++'}>C++</MenuItem>
              <MenuItem value={'PHP'}>PHP</MenuItem>
              <MenuItem value={'TypeScript'}>TypeScript</MenuItem>
              <MenuItem value={'Ruby'}>Ruby</MenuItem>
              <MenuItem value={'Go'}>Go</MenuItem>
              <MenuItem value={'Assembly'}>Assembly</MenuItem>
              <MenuItem value={'Swift'}>Swift</MenuItem>
              <MenuItem value={'Kotlin'}>Kotlin</MenuItem>
            </Select>
            <FormHelperText>
              {error.fields.includes(4) ? error.message[4] : null}
            </FormHelperText>
          </FormControl>

          <TextField
            id="standard-basic"
            label="Github Username"
            variant="filled"
            value={fields.githubUsername}
            onChange={e => handleChange(e, 'githubUsername')}
          />

          <TextField
            className={classes.bio}
            id="standard-basic"
            multiline
            label="A short bio about yourself"
            variant="outlined"
            value={fields.bio}
            onChange={e => handleChange(e, 'bio')}
          />
        </form>

        <Box mt={4} display="flex">
          <Button
            variant="contained"
            color="primary"
            onClick={handleToggleSocials}
          >
            Add Social Network Links (optional)
          </Button>

          <Box ml={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Apply changes
            </Button>
          </Box>
        </Box>

        {socialsIsOpen ? (
          <Box mt={2} className={classes.socialLinks}>
            <Box display="flex">
              <Box
                mx={3}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <TwitterIcon style={{ color: '#00acee ' }} />
              </Box>

              <TextField
                fullWidth
                id="standard-basic"
                label="Twitter URL"
                value={fields.social.twitter}
                onChange={e => handleChangeSocial(e, 'twitter')}
              />
            </Box>

            <Box display="flex">
              <Box
                mx={3}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <FacebookIcon style={{ color: '#3b5998' }} />
              </Box>

              <TextField
                fullWidth
                id="standard-basic"
                label="Facebook URL"
                value={fields.social.facebook}
                onChange={e => handleChangeSocial(e, 'facebook')}
              />
            </Box>

            <Box display="flex">
              <Box
                mx={3}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <YouTubeIcon style={{ color: '#c4302b' }} />
              </Box>

              <TextField
                fullWidth
                id="standard-basic"
                label="Youtube URL"
                value={fields.social.youtube}
                onChange={e => handleChangeSocial(e, 'youtube')}
              />
            </Box>

            <Box display="flex">
              <Box
                mx={3}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <LinkedInIcon style={{ color: '#0e76a8' }} />
              </Box>

              <TextField
                fullWidth
                id="standard-basic"
                label="Linkedin URL"
                value={fields.social.linkedin}
                onChange={e => handleChangeSocial(e, 'linkedin')}
              />
            </Box>

            <Box display="flex">
              <Box
                mx={3}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <InstagramIcon style={{ color: '#3f51b5' }} />
              </Box>

              <TextField
                fullWidth
                id="standard-basic"
                label="Instagram URL"
                value={fields.social.instagram}
                onChange={e => handleChangeSocial(e, 'instagram')}
              />
            </Box>
          </Box>
        ) : null}
      </Box>
    </Typography>
  )
}

export default CreateProfilePage
