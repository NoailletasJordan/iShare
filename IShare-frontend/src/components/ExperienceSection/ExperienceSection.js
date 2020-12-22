import React from 'react'
import { Box } from '@material-ui/core'
import ExperienceGrid from '../../components/ExperienceGrid/ExperienceGrid'

const ExperienceSection = (props) => {
  return props.profileVisited.experience &&
    props.profileVisited.experience.length ? (
    <Box mb={3}>
      <Box className={props.classes.sectionTitle}>Experience</Box>
      <Box className={props.classes.separator} mt={0.5} mb={1.5} />

      {props.profileVisited.experience.map((exp) => (
        <ExperienceGrid
          key={exp._id}
          {...exp}
          capitalize={props.capitalize}
          convertDate={props.convertDate}
          classes={props.classes}
        />
      ))}
    </Box>
  ) : null
}

export default ExperienceSection
