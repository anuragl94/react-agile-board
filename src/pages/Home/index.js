import React, { Component, Fragment } from 'react'
// import { asyncHoC } from '../../components/AsyncComponent'
import AgileBoard from '../../containers/AgileBoard'

import API from '../../lib/api'

// const api = new API('/cards')

// const ProjectsList = asyncHoC({
//   fetch: api.get,
//   Component: ({ data = [] }) => (
//     <ul className='projects-list'>
//       {data.map(({ id, name }) => (
//         <li key={id}>{name}</li>
//       ))}
//     </ul>
//   ),
//   Loader: props => (
//     <div>Loading...</div>
//   ),
//   Error: ({ retry }) => (
//     <button onClick={retry}>Retry</button>
//   )
// })

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: null
    }
    this.api = new API('/list')
    this.initBoard = this.initBoard.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  initBoard () {
    this.setState({
      initializing: true
    })
    // window.setTimeout(() => {
    Promise.all([
      this.api.post({ name: 'To do', cards: [] }),
      this.api.post({ name: 'In progress', cards: [] }),
      this.api.post({ name: 'Done', cards: [] })
    ]).then(data => {
      this.setState({ data, initializing: false })
    })
    // }, 3000)
  }
  syncResults ({ lists }) {
    // This method communicates changes to the API
    // Ideally, changes should be saved periodically instead of after
    // every change that the user makes. But, for this demo, I'll
    // call the API before updating own state
    return Promise.all(lists.map(this.api.put))
  }
  onChange (lists) {
    this.syncResults({ lists })
    .then(() => { this.setState({ data: lists }) })
  }
  componentDidMount () {
    this.api.get().then(data => { this.setState({ data }) })
  }
  render () {
    let view = null
    if (!this.state.data) {
      view = <div>Loading...</div>
    } else if (!this.state.data.length) {
      view = (
        <Fragment>
          <h1>Agile Board</h1>
          <div>Welcome to the best Agile Board in the market</div>
          <div>
            <button
              onClick={this.initBoard}
              disabled={this.state.initializing}
            >Get started</button>
          </div>
        </Fragment>
      )
    } else {
      view = (
        <Fragment>
          <AgileBoard lists={this.state.data} onChange={this.onChange} />
        </Fragment>
      )
    }
    return (
      <div className='Home'>
        {view}
      </div>
    )
  }
}