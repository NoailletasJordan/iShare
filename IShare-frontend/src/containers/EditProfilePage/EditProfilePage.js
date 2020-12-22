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
  Select
} from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import TwitterIcon from '@material-ui/icons/Twitter'
import FacebookIcon from '@material-ui/icons/Facebook'
import InstagramIcon from '@material-ui/icons/Instagram'
import YouTubeIcon from '@material-ui/icons/YouTube'
import LinkedInIcon from '@material-ui/icons/LinkedIn'

//Provide the entire state

const useStyles = makeStyles(theme => ({
  editProfilePage: {
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
    marginTop: ' 24px'
  },
  bio: {
    gridColumn: '1/ -1'
  },
  socialLinks: {
    display: 'grid',
    gridRowGap: '16px'
  }
}))

const EditProfilePage = props => {
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

  const [socialsIsOpen, setSocialsIsOpen] = useState(false)

  const handleToggleSocials = () => setSocialsIsOpen(!socialsIsOpen)

  const handleChange = (e, specificInput) =>
    setFields({ ...fields, [specificInput]: e.target.value })

  const handleChangeSocial = (e, specificInput) => {
    const newSocial = { ...fields.social }
    newSocial[specificInput] = e.target.value
    setFields({ ...fields, social: newSocial })
  }

  const classes = useStyles()
  return (
    <Typography component="div" className={classes.editProfilePage}>
      <Box width="80vw" maxWidth="1300px" mt={3}>
        <Box
          component="h2"
          color="secondary.main"
          fontWeight="500"
          fontSize="h4.fontSize"
          letterSpacing={5}
        >
          Modify Your Profile
        </Box>

        <Box component="h4" fontWeight="500" className={classes.subtitle}>
          <PersonIcon />
          Got some updates de make ? Here you go
        </Box>

        <form className={classes.form}>
          <FormControl variant="filled">
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
              <MenuItem value={'developer'}>Developer</MenuItem>
              <MenuItem value={'Junior developer'}>Junior developer</MenuItem>
              <MenuItem value={'Senior developer'}>Senior developer</MenuItem>
              <MenuItem value={'Manager'}>Manager</MenuItem>
              <MenuItem value={'Student'}>Student or Learning</MenuItem>
              <MenuItem value={'Instructor'}>Instructor</MenuItem>
              <MenuItem value={'Intern'}>Intern</MenuItem>
              <MenuItem value={'Other'}>Other</MenuItem>
            </Select>
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
          />

          <FormControl variant="filled">
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
              <MenuItem value={'Manager'}>Python</MenuItem>
              <MenuItem value={'Java'}>Java</MenuItem>
              <MenuItem value={'Node'}>Node</MenuItem>
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

        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleToggleSocials}
          >
            Add Social Network Links (optional)
          </Button>
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

export default EditProfilePage
