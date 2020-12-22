import React from 'react'
import './DashboardCreadentialEduGrid.styles.scss'
import DashboardCredentialEduElement from '../DashboardCredentialEduElement/DashboardCredentialEduElement'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const DashboardCredentialEduGrid = props => {
  const profile = useSelector(state => state.profile)

  // put the list in order
  if (profile.education[0]) {
    profile.education.sort(function(a, b) {
      return new Date(b.from) - new Date(a.from)
    })
  }

  const eduEltList = profile.education.map(edu => (
    <DashboardCredentialEduElement
      key={edu._id}
      {...edu}
      handleDeleteEducation={() => props.handleDeleteEducation(edu._id)}
      convertDate={props.convertDate}
    />
  ))

  return (
    <div className="dashboard-credential-edu-grid u-margin-top-16">
      <div className="dashboard-credential-edu-grid__header">
        <p className="dashboard-credential-edu-grid__header--school">School</p>
        <p className="dashboard-credential-edu-grid__header--degree">Degree</p>
        <p className="dashboard-credential-edu-grid__header--years">Years</p>
        <p className="dashboard-credential-edu-grid__header--empty">empty</p>
      </div>
      <div className="dashboard-credential-edu-grid__body u-padding-top-8">
        {eduEltList.length ? (
          eduEltList
        ) : (
          <div className="dashboard-credential-edu-grid__empty-block">
            You have not added any education yet,{' '}
            <Link to="/add-education" className="u-list-unstyled">
              begin now
            </Link>
          </div>
        )}
      </div>

      <div className="dashboard-credential-edu-grid__body  u-padding-top-8"></div>
    </div>
  )
}

export default DashboardCredentialEduGrid
