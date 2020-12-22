import React from 'react'
import { Box, Chip } from '@material-ui/core'

const ExpertiseSection = (props) => {
  return (
    <Box display="flex" flexWrap="wrap" mb={3}>
      <Box className={props.classes.sectionTitle}>Expertise</Box>
      <Box className={props.classes.separator} mt={0.5} mb={1.5} />
      {props.profileVisited.skills
        ? props.profileVisited.skills.map((skill) => (
            <Box
              key={Math.random()}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx={1}
              mb={1}
            >
              <Chip label={skill} color="primary" />
            </Box>
          ))
        : null}
    </Box>
  )
}

export default ExpertiseSection
