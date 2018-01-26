import React, { Component as ReactComponent } from 'react'

function asyncHoC ({ fetch, Component = null, Loader = null, Error = null }) {
  return class AsyncComponent extends ReactComponent {
    constructor (props) {
      super(props)
      this.state = {
        data: null,
        loader: false,
        error: false
      }
    }
    getData () {
      this.setState({ loader: true, error: false }, () => {
        fetch()
        .then(response => { this.setState({ data: response }) })
        .then(() => { this.setState({ loader: false }) })
        .catch(error => { this.setState({ error }) })
      })
    }
    componentDidMount () {
      this.getData()
    }
    render () {
      if (this.state.data) {
        return <Component data={this.state.data} {...this.props} />
      } else if (this.state.loading) {
        return <Loader />
      } else if (this.state.error) {
        return <Error retry={this.getData} />
      }
      return null
    }
  }
}

export { asyncHoC }