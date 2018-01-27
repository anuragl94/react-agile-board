/*
  A localStorage based API mirroring the format of typical asynchronous API calls
*/

const initialState = []

export default class API {
  constructor (url = '') {
    this.url = url.replace(/^\/+/g, '')
    this.get = this.get.bind(this)
    this.post = this.post.bind(this)
    this.put = this.put.bind(this)
  }
  get ({ id } = {}) {
    let collection = window.localStorage.getItem(`data/${this.url}`)
    collection = collection ? JSON.parse(collection) : initialState
    if (id) {
      let result = collection.find(item => (
        item.id === id
      ))
      return (
        result
        ? Promise.resolve(result)
        : Promise.reject(`This resource doesn't exist!`)
      )
    } else {
      return Promise.resolve(collection)
    }
  }
  put ({ id, ...data } = {}) {
    if (!id) {
      return Promise.reject(`Missing required field - 'id'`)
    }
    let collection = window.localStorage.getItem(`data/${this.url}`)
    collection = collection ? JSON.parse(collection) : []
    let index = collection.findIndex(item => item.id === id)
    Object.assign(collection[index], data)
    window.localStorage.setItem(`data/${this.url}`, JSON.stringify(collection))
    return Promise.resolve(collection[index])
  }
  post (data = {}) {
    let index = localStorage.getItem('dataIndex')
    index = index ? JSON.parse(index) : {}
    let id = 1
    if (this.url in index) {
      id = index[this.url] + 1
    }
    Object.assign(data, { id })
    index[this.url] = id
    let collection = window.localStorage.getItem(`data/${this.url}`)
    collection = collection ? JSON.parse(collection) : []
    collection.push(data)
    localStorage.setItem(`data/${this.url}`, JSON.stringify(collection))
    localStorage.setItem('dataIndex', JSON.stringify(index))
    return Promise.resolve(data)
  }
  delete ({ id }) {
    if (!id) {
      return Promise.reject(`Missing required field - 'id'`)
    }
    let collection = window.localStorage.getItem(`data/${this.url}`)
    let index = collection.findIndex(item => item.id === id)
    collection.splice(index, 1)
    window.localStorage.setItem(`data/${this.url}`, JSON.stringify(collection))
    return Promise.resolve()
  }
}

function purge () {
  window.localStorage.clear()
  return Promise.resolve()
}

export { purge }