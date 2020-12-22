import React, { Fragment } from 'react'
import { Grid } from '@material-ui/core'

const EducationGrid = (props) => {
  return (
    <Fragment>
      <Grid container alignItems="center">
        <Grid item sm={3} xs={4} className={props.classes.title}>
          {props.school}
        </Grid>
        <Grid item sm={4} xs={4} className={props.classes.sizeQuerie}>
          {props.from ? props.convertDate(props.from) : null} -{' '}
          {props.to ? props.convertDate(props.to) : null}
        </Grid>

        <Grid item sm={5} xs={4} className={props.classes.sizeQuerie}>
          {props.capitalize(props.degree)}
        </Grid>
      </Grid>

      {props.divider ? '<hr className="divider u-margin-top-26" />' : null}
    </Fragment>
  )
}

export default EducationGrid
