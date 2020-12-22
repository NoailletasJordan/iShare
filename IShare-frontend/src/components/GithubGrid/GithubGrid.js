import React, { Fragment } from 'react'
import './GithubGrid.styles.scss'

const GithubGrid = (props) => {
  return (
    <Fragment>
      <div className="github-grid">
        <div className="github-grid--left">
          <a href={props.clone_url} className={props.classes.title}>
            {props.name}
          </a>
          <p className={props.classes.sizeQuerie}>{props.description}</p>
        </div>

        <div className="github-grid--right">
          <div className="github-grid__list-details">
            <div className="github-grid__list-details--stars">{`Stars: ${props.stargazers_count}`}</div>
            <div className="github-grid__list-details--watchers">
              {`Watchers: ${props.watchers_count}`}
            </div>
            <div className="github-grid__list-details--forks">{`Forks: ${props.forks_count}`}</div>
          </div>
        </div>
      </div>

      {props.divider ? '<hr className="divider u-margin-top-26" />' : null}
    </Fragment>
  )
}

export default GithubGrid
