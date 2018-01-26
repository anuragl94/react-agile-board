import React, { Component } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import AgileCard from './AgileCard'

const grid = 8
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
  margin: 20
})

class AgileList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newcard: null
    }
    this.addNewCard = this.addNewCard.bind(this)
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
  render () {
    let list = this.props.data
    return (
      <Droppable droppableId={`list-${list.id}`}>
        {(provided, snapshot) => (
          <div
            className='AgileList'
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <h4>{list.name}</h4>
            {list.cards.map((item, index) => (
              <AgileCard key={`item-${item.id}`} data={item} index={index} />
            ))}
            {provided.placeholder}
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
            ) : (
              <button onClick={() => { this.setState({ newcard: true }) }}>
                Add new card
              </button>
            )}
          </div>
        )}
      </Droppable>
    )
  }
}

export default AgileList