/* global __CLIENT__ __DEVELOPMENT__ */
/* eslint-disable no-undef */
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import HomeComponent from '../components/Home'

export class Home extends Component {
  constructor(props) {
    super(props)
    this.handleListChapters = this.handleListChapters.bind(this)
    this.handleListPlayers = this.handleListPlayers.bind(this)
    this.handleGraphiQL = this.handleGraphiQL.bind(this)
    this.handleSignOut = this.handleSignOut.bind(this)
  }

  handleListChapters() {
    const {dispatch} = this.props
    dispatch(push('/chapters'))
  }

  handleListPlayers() {
    const {dispatch} = this.props
    dispatch(push('/players'))
  }

  handleGraphiQL() {
    if (__CLIENT__) {
      const graphiqlAppName = 'graphiql.learnersguild'
      window.location.href = __DEVELOPMENT__ ? `http://${graphiqlAppName}.dev` : `https://${graphiqlAppName}.org`
    }
  }

  handleSignOut() {
    if (__CLIENT__) {
      const idmAppName = 'idm.learnersguild'
      const idmBaseUrl = __DEVELOPMENT__ ? `http://${idmAppName}.dev` : `https://${idmAppName}.org`
      window.location.href = `${idmBaseUrl}/auth/sign-out`
    }
  }

  render() {
    return (
      <HomeComponent
        onListChapters={this.handleListChapters}
        onListPlayers={this.handleListPlayers}
        onGraphiQL={this.handleGraphiQL}
        onSignOut={this.handleSignOut}
        />
    )
  }
}

Home.propTypes = {
  children: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
}

export default connect()(Home)
