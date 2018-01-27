import React, { Component } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import AgileList from './AgileList'

import './style.css'

const reorder = (lists, source, destination) => {
  // An ideal method would deep clone the data before modifying the result to
  // avoid side-effects. For this demo, I have consciously modified the original
  // data itself for ease of use.
  let sourceCards = lists.find(
    board => board.id === Number(source.droppableId.replace('list-', ''))
  ).cards
  let destinationCards = lists.find(
    board => board.id === Number(destination.droppableId.replace('list-', ''))
  ).cards
  let [card] = sourceCards.splice(source.index, 1)
  destinationCards.splice(destination.index, 0, card)
  return lists
}

let scrollTimer = null
let currentOffset = 0

function startScrolling (offset = 0, timeout = 10) {
  if (offset === currentOffset) {
    return
  }
  stopScrolling()
  currentOffset = offset
  scrollTimer = window.setInterval(() => {
    document.querySelector('.Home').scrollLeft += offset
  }, timeout)
}

function stopScrolling () {
  window.clearInterval(scrollTimer)
}

function mouseMoveHandler (e) {
  let x = e.x
  if (!x) {
    x = e.touches && e.touches.length ? e.touches[0].clientX : null
  }
  if (!x) {
    return
  }
  if (x > (window.innerWidth - 40)) {
    startScrolling(10, 10)
  } else if (x < 40) {
    startScrolling(-10, 10)
  } else {
    stopScrolling()
  }
}

export default class AgileBoard extends Component {
  constructor(props) {
    super(props)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.updateList = this.updateList.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
  }
  onDragStart (data) {
    window.addEventListener('mousemove', mouseMoveHandler)
    window.addEventListener('touchmove', mouseMoveHandler)
  }
  onDragEnd (result) {
    stopScrolling()
    window.removeEventListener('mousemove', mouseMoveHandler)
    window.removeEventListener('touchmove', mouseMoveHandler)
    // dropped outside the list
    if (!result.destination) {
      return
    }
    const lists = reorder(
      this.props.lists,
      result.source,
      result.destination
    )
    this.props.onChange && this.props.onChange(lists)
  }
  updateList (data) {
    let oldListIndex = this.props.lists.findIndex(list => list.id === data.id)
    let updatedLists = [...this.props.lists]
    updatedLists.splice(oldListIndex, 1, data)
    this.props.onChange && this.props.onChange(updatedLists)
  }
  componentWillUnmount () {
    window.removeEventListener('mousemove', mouseMoveHandler)
    window.removeEventListener('touchmove', mouseMoveHandler)
  }
  render () {
    return (
      <div className='AgileBoard'>
        <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
          {this.props.lists.map(board => (
            <AgileList key={board.id} data={board} onChange={this.updateList} />
          ))}
        </DragDropContext>
      </div>
    )
  }
}