import React from 'react'
import { Box } from '@material-ui/core'
import EducationGrid from '../../components/EducationGrid/EducationGrid'

const EducationSection = (props) => {
  return props.profileVisited.education &&
    props.profileVisited.education.length ? (
    <Box mb={2}>
      <Box className={props.classes.sectionTitle}>Education</Box>
      <Box className={props.classes.separator} mt={0.5} mb={1.5} />

      {props.profileVisited.education.map((exp) => (
        <EducationGrid
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

export default EducationSection
