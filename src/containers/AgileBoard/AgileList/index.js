import React, { Component } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import AgileCard from '../AgileCard'

import './style.css'

class AgileList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newcard: null,
      editing: null
    }
    this.addNewCard = this.addNewCard.bind(this)
    this.editCard = this.editCard.bind(this)
    this.removeCard = this.removeCard.bind(this)
  }
  addNewCard (card) {
    let data = Object.assign({}, this.props.data, {
      cards: [...this.props.data.cards, card]
    })
    this.setState({
      newcard: null
    }, () => {
      this.props.onChange && this.props.onChange(data)
    })
  }
  editCard (card) {
    let data = Object.assign({}, this.props.data, {
      cards: [...this.props.data.cards]
    })
    let cardIndex = data.cards.findIndex(i => i.id === card.id)
    data.cards.splice(cardIndex, 1, card)
    this.setState({
      editing: null
    }, () => {
      this.props.onChange && this.props.onChange(data)
    })
  }
  removeCard (cardId) {
    let data = Object.assign({}, this.props.data, {
      cards: [...this.props.data.cards.filter(card => card.id !== cardId)]
    })
    this.setState({
      editing: null
    }, () => {
      this.props.onChange && this.props.onChange(data)
    })
  }
  render () {
    let list = this.props.data
    return (
      <div className='AgileList'>
        <div className='title'>
          <h4>{list.name}</h4>
          {!this.state.newcard ? (
            <button className='add-button' onClick={() => { this.setState({ newcard: true }) }}>
              <strong>+</strong>
            </button>
          ) : null}
        </div>
        <Droppable droppableId={`list-${list.id}`}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef}>
              {list.cards.map((item, index) => (
                <AgileCard
                  key={`item-${item.id}`}
                  data={item}
                  index={index}
                  edit={this.state.editing === index}
                  onOpen={() => { this.setState({ editing: index }) }}
                  onChange={this.editCard}
                  onDelete={() => { this.removeCard(item.id) }}
                  onCancel={() => { this.setState({ editing: null }) }}
                />
              ))}
              {!list.cards.length ? (
                <div className='empty-message'>
                  This list is empty!
                  {provided.placeholder}
                </div>
              ) : provided.placeholder}
              {this.state.newcard ? (
                <AgileCard
                  data={{
                    id: new Date().getTime(),
                    title: '',
                    content: ''
                  }}
                  edit={true}
                  onChange={this.addNewCard}
                  onCancel={() => { this.setState({ newcard: null }) }}
                />
              ) : null}
            </div>
          )}
        </Droppable>
      </div>
    )
  }
}

export default AgileList