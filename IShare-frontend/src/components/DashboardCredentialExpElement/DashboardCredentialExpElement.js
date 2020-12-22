import React from 'react'
import { Button, makeStyles } from '@material-ui/core'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import './DashboardCredentialExpElement.styles.scss'

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

const DashboardCredentialExpElement = props => {
  const classes = useStyles()

  return (
    <div className="dashboard-credential-exp-element">
      <div className="dashboard-credential-exp-element--company">
        {props.company}
      </div>
      <div className="dashboard-credential-exp-element--title">
        {props.title}
      </div>
      <div className="dashboard-credential-exp-element--years">
        <span>{props.convertDate(props.from)}</span>
        <div className={classes.separator}>-</div>
        <span>{props.convertDate(props.to)}</span>
      </div>
      <div className="dashboard-credential-exp-element--delete">
        <Button
          variant="contained"
          size="small"
          className={classes.button}
          onClick={props.handleDeleteExperience}
        >
          <DeleteForeverIcon fontSize="small" />
        </Button>
      </div>
    </div>
  )
}

export default DashboardCredentialExpElement
