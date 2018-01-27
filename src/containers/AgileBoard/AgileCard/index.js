import React, { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import Editor from '../Editor'

import './style.css'

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
 
  // styles we need to apply on draggables
  ...draggableStyle,
})

class AgileCard extends Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }
  onChange (data) {
    this.props.onChange && this.props.onChange(Object.assign({}, this.props.data, data))
  }
  render () {
    let item = this.props.data
    let index = this.props.index
    let { title, content } = this.props.data
    return (
      <div onClick={this.props.onOpen}>
        <Draggable draggableId={`item-${item.id}`} index={index}>
          {(provided, snapshot) => (
            <div className='AgileCard'>
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style,
                )}
              >
                {item.title}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Draggable>
        {this.props.edit && (
          <Editor
            title={title}
            content={content}
            onSave={this.onChange}
            onDelete={this.props.onDelete}
            onCancel={this.props.onCancel}
          />     
        )}   
      </div>
    )
  }
}

export default AgileCard
