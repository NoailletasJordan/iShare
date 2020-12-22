import React, { useState, useEffect } from 'react'
import './DevelopersPage.styles.scss'
import {
  Typography,
  Box,
  TextField,
  CircularProgress,
  Chip,
} from '@material-ui/core'
import AccessibilityIcon from '@material-ui/icons/Accessibility'
import ProfileMini from '../../components/ProfileMini/ProfileMini'
import { ajaxFunction } from '../../fetch'
import WarningIcon from '@material-ui/icons/Warning'

const DevelopersPage = (props) => {
  const [profileList, setProfileList] = useState([])
  const [value, setValue] = React.useState('')
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const getAllProfilesFromDatabase = async () => {
      //send to backend
      const { err, data } = await ajaxFunction('GET', '/api/profile/', false)
      if (err) return console.log(err.message) //error

      //update state
      setProfileList(data)
    }
    getAllProfilesFromDatabase().then(() => setIsLoading(false))
  }, [])

  const handleChange = (event) => {
    console.log(event.target.value)
    setValue(event.target.value)
  }

  const ProfileListFiltered = () => {
    //if search empty
    if (!value.length) return profileList

    //if user typed
    return profileList.filter((elt) => {
      if (
        elt.skills.filter((skill) =>
          skill.toLocaleLowerCase().includes(value.toLocaleLowerCase())
        ).length
      )
        return true
      else return false
    })
  }

  return (
    <div className="developers-page u-padding-top-32">
      <Typography component="div" className="developers-page__inner">
        <Box
          component="h2"
          color="secondary.main"
          fontWeight="500"
          fontSize="h4.fontSize"
          letterSpacing={5}
        >
          Developers
        </Box>

        <Box
          component="h4"
          fontWeight="500"
          className="developers-page__subtitle"
        >
          <Box mr={1} display="flex">
            <AccessibilityIcon />

            <Box component="p" ml={1} mr="auto" mb={3}>
              Browse and connect with developers
            </Box>
          </Box>

          <TextField
            className="developers-page__textField"
            id="standard-basic"
            value={value}
            onChange={(e) => handleChange(e)}
            label="Find a dev by skill"
          />
        </Box>

        <div className="developers-page__profiles-mini u-padding-top-24">
          {
            isLoading ? (
              <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress size={80} />
              </Box>
            ) : ProfileListFiltered().length && profileList.length ? ( //dev received and user typed
              ProfileListFiltered().map((profile) => (
                <ProfileMini key={profile._id} {...profile} />
              ))
            ) : !ProfileListFiltered().length && profileList.length ? ( //dev received, but nothing passed filter
              <Box
                m={4}
                fontSize="h5.fontSize"
                color="warning.main"
                display="flex"
                alignItems="center"
              >
                <WarningIcon />
                <Box ml={1}>Nothing matches your criteria !</Box>
              </Box>
            ) : null //dev still loading
          }
        </div>
      </Typography>
    </div>
  )
}

export default DevelopersPage
