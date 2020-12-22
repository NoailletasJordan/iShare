import React, { useState, useEffect } from 'react'
import { Box } from '@material-ui/core'

import GithubGrid from '../../components/GithubGrid/GithubGrid'
import { ajaxFunction } from '../../fetch'

const GithubSection = (props) => {
  const [isGithub, setIsGithub] = useState(false)
  const [githubContent, setGithubContent] = useState([])

  //get github repos from API if usename provided
  useEffect(() => {
    if (props.profileVisited.githubusername) {
      getGithubReposFromAPI()
    } else setIsGithub(false)
  }, [props.profileVisited.githubusername])

  const getGithubReposFromAPI = async () => {
    const { err, data } = await ajaxFunction(
      'GET',
      `/api/profile/github/${props.profileVisited.githubusername}`,
      false
    )
    if (err) return console.log(err.message) //error

    setGithubContent(data)
    setIsGithub(true)
  }

  return isGithub ? (
    <Box mb={3}>
      <Box className={props.classes.sectionTitle}>Github </Box>
      <Box className={props.classes.separator} mt={0.5} mb={1.5} />
      {
        <Box className="swipable__education">
          {githubContent.map((repo) => (
            <GithubGrid key={repo.id} classes={props.classes} {...repo} />
          ))}
        </Box>
      }
    </Box>
  ) : null
}

export default GithubSection
