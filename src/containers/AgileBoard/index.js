import React, { Component } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import AgileList from './AgileList'

import './style.css'
 
// fake data generator
const getItems = count => Array.from({ length: count }, (v, k) => k).map(k => ({
  id: k,
  content: `item ${k}`
}))

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

export default class AgileBoard extends Component {
  constructor(props) {
    super(props)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.updateList = this.updateList.bind(this)
  }
  onDragEnd(result) {
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
  render () {
    return (
      <div className='AgileBoard'>
        <DragDropContext onDragEnd={this.onDragEnd}>
          {this.props.lists.map(board => (
            <AgileList key={board.id} data={board} onChange={this.updateList} />
          ))}
        </DragDropContext>
      </div>
    )
  }
}