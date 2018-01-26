import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from './pages/Home'
import Error404 from './pages/Error/404'

export default class Router extends Component {
  render () {
    return (
      <Switch>
        <Route path='/' component={Home} />
        <Route component={Error404} />
      </Switch>
    )
  }
}
