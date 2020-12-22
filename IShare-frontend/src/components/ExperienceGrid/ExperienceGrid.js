import React, { Fragment } from 'react'
import { Grid } from '@material-ui/core'

const ExperienceGrid = (props) => {
  return (
    <Fragment>
      <Grid container alignItems="center" className={props.classes.outerBox}>
        <Grid item sm={3} xs={4} className={props.classes.title}>
          {props.company}
        </Grid>
        <Grid item sm={4} xs={4} className={props.classes.sizeQuerie}>
          {props.from ? props.convertDate(props.from) : null} -{' '}
          {props.to ? props.convertDate(props.to) : null}
        </Grid>

        <Grid item sm={5} xs={4} className={props.classes.sizeQuerie}>
          {`${props.capitalize(props.title)}`}
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default ExperienceGrid
