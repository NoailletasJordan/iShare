import React from 'react'
import './DashboardCredentialExpGrid.styles.scss'
import DashboardCredentialExpElement from '../DashboardCredentialExpElement/DashboardCredentialExpElement'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const DashboardCredentialExpGrid = props => {
  const profile = useSelector(state => state.profile)

  // put the list in order
  if (profile.experience[0]) {
    profile.experience.sort(function(a, b) {
      return new Date(b.from) - new Date(a.from)
    })
  }

  const expEltList = profile.experience.map(exp => (
    <DashboardCredentialExpElement
      key={exp._id}
      {...exp}
      handleDeleteExperience={() => props.handleDeleteExperience(exp._id)}
      convertDate={props.convertDate}
    />
  ))

  return (
    <div className="dashboard-credential-exp-grid u-margin-top-16">
      <div className="dashboard-credential-exp-grid__header">
        <p className="dashboard-credential-exp-grid__header--company">
          Company
        </p>
        <p className="dashboard-credential-exp-grid__header--title">Title</p>
        <p className="dashboard-credential-exp-grid__header--years">Years</p>
        <p className="dashboard-credential-exp-grid__header--empty">empty</p>
      </div>
      <div className="dashboard-credential-exp-grid__body u-padding-top-8">
        {expEltList.length ? (
          expEltList
        ) : (
          <div className="dashboard-credential-exp-grid__empty-block">
            You have not added any experience yet,{' '}
            <Link to="/add-experience" className="u-list-unstyled">
              begin now
            </Link>
          </div>
        )}
      </div>

      <div className="dashboard-credential-edu-grid__body  u-padding-top-8"></div>
    </div>
  )
}

export default DashboardCredentialExpGrid
