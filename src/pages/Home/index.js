import React, { Component, Fragment } from 'react'
// import { asyncHoC } from '../../components/AsyncComponent'
import AgileBoard from '../../containers/AgileBoard'
import API, { purge } from '../../lib/api'

import './style.css'

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
    this.deleteAllData = this.deleteAllData.bind(this)
    this.loadData = this.loadData.bind(this)
  }
  initBoard () {
    this.setState({
      initializing: true
    })
    Promise.all([
      this.api.post({ name: 'To do', cards: [] }),
      this.api.post({ name: 'In progress', cards: [] }),
      this.api.post({ name: 'Done', cards: [] })
    ]).then(data => {
      this.setState({ data, initializing: false })
    })
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
  deleteAllData () {
    if (window.confirm('This will delete all the data and reset the application')) {
      purge().then(this.loadData)
    }
  }
  loadData () {
    this.api.get().then(data => { this.setState({ data }) })
  }
  componentDidMount () {
    this.loadData()
  }
  render () {
    var view
    let headerExpanded = true
    if (!this.state.data) {
      view = <div>Loading...</div>
    } else if (!this.state.data.length) {
      view = (
        <Fragment>
          <div>Welcome to the best Agile Board in the market</div>
          <button
            className='start-button'
            onClick={this.initBoard}
            disabled={this.state.initializing}
          >Get started</button>
        </Fragment>
      )
    } else {
      headerExpanded = false
      view = (
        <Fragment>
          <AgileBoard lists={this.state.data} onChange={this.onChange} />
        </Fragment>
      )
    }
    return (
      <div className={`Home ${headerExpanded ? 'initScreen' : 'interactiveScreen'}`.trim()}>
        <header className={headerExpanded ? 'expanded' : 'collapsed'}>
          <h1>Agile Board</h1>
          {!headerExpanded ? (
            <div className='header-actions'>
              <button
                className='delete-button'
                title='Delete board'
                onClick={this.deleteAllData}
              />
            </div>
          ) : null}
        </header>
        {view}
      </div>
    )
  }
}