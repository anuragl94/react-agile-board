import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './style.css'

class Editor extends Component {
  constructor (props) {
    super(props)
    this.state = (({ title, content }) => ({ title, content }))(this.props)
    this.onSave = this.onSave.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }
  onSave () {
    let data = {
      title: this.state.title,
      content: this.state.content
    }
    this.props.onSave && this.props.onSave(data)
  }
  onCancel () {
    this.props.onCancel && this.props.onCancel()
  }
  render () {
    return ReactDOM.createPortal(
      <div className='Editor'>
        <div className='canvas'>
          <div className='main'>
            <input
              autoFocus
              className='title-input'
              value={this.state.title}
              onChange={e => { this.setState({ title: e.target.value }) }}
            />
            <textarea
              className='content-input'
              value={this.state.content}
              onChange={e => { this.setState({ content: e.target.value }) }}
            />
          </div>
          <div className='actions'>
            <button onClick={this.onSave}>Save</button>
            <button onClick={this.onCancel}>Cancel</button>
          </div>
        </div>
      </div>,
      document.getElementById('modal-root'),
    )
  }
}

export default Editor