import React from 'react'
import { Button, makeStyles } from '@material-ui/core'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import './DashboardCredentialEduElement.styles.scss'

const useStyles = makeStyles(theme => ({
  button: {
    background: theme.palette.error.light,
    color: 'white',
    '&:hover': {
      background: theme.palette.error.main
    }
  },
  separator: {
    margin: '0 4px'
  }
}))

const DashboardCredentialEduElement = props => {
  const classes = useStyles()
  return (
    <div className="dashboard-credential-edu-element">
      <div className="dashboard-credential-edu-element--school">
        {props.school}
      </div>
      <div className="dashboard-credential-edu-element--degree">
        {props.degree}
      </div>
      <div className="dashboard-credential-edu-element--years">
        <span>{props.convertDate(props.from)}</span>
        <div className={classes.separator}>-</div>
        <span>{props.convertDate(props.to)}</span>
      </div>
      <div className="dashboard-credential-edu-element--delete">
        <Button
          variant="contained"
          size="small"
          className={classes.button}
          onClick={props.handleDeleteEducation}
        >
          <DeleteForeverIcon fontSize="small" />
        </Button>
      </div>
    </div>
  )
}

export default DashboardCredentialEduElement
