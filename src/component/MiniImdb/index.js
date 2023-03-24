import {Component} from 'react'

import StarRatingComponent from 'react-star-rating-component'

import {v4} from 'uuid'

import './index.css'

const tagsList = [
  {
    optionId: 'HINDI',
    displayText: 'Hindi',
  },
  {
    optionId: 'TELUGU',
    displayText: 'Telugu',
  },
  {
    optionId: 'ENGLISH',
    displayText: 'English',
  },
]

class MiniImdb extends Component {
  state = {
    inputTitle: '',
    inputDescription: '',
    inputImage: '',
    inputTag: tagsList[0].optionId,
    taskList: [],
    activeTag: 'INITIAL',
    sortBy: '',
    rating: 0,
  }

  onStarClick = () => {
    this.setState(prevState => ({
      rating: prevState.rating + 1,
    }))
  }

  changeInputTitle = event => {
    this.setState({inputTitle: event.target.value})
  }

  changeInputDescription = event => {
    this.setState({inputDescription: event.target.value})
  }

  changeInputImage = event => {
    this.setState({inputImage: event.target.value})
  }

  onChangeTag = event => {
    this.setState({inputTag: event.target.value})
  }

  onClickActiveTag = event => {
    this.setState(prevState => ({
      activeTag:
        prevState.activeTag === event.target.value
          ? 'INITIAL'
          : event.target.value,
    }))
  }

  onChangeTitle = event => {
    this.sortArray(event.target.value)
  }

  submitForm = event => {
    event.preventDefault()
    const {
      inputTitle,
      inputTag,
      inputImage,
      rating,
      inputDescription,
    } = this.state

    const newTask = {
      id: v4(),
      title: inputTitle,
      image: inputImage,
      description: inputDescription,
      tag: inputTag,
      rate: rating,
    }

    this.setState(prevState => ({
      taskList: [...prevState.taskList, newTask],
      inputTitle: '',
      rating: 0,
      inputDescription: '',
      inputImage: '',
    }))
  }

  sortMovies = sortBy => {
    const {taskList} = this.state

    if (sortBy === 'titleAscending') {
      taskList.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'titleDescending') {
      taskList.sort((a, b) => b.title.localeCompare(a.title))
    } else if (sortBy === 'ratingAscending') {
      taskList.sort((a, b) => a.rate - b.rate)
    } else if (sortBy === 'ratingDescending') {
      taskList.sort((a, b) => b.rate - a.rate)
    }
    this.setState({taskList, sortBy})
  }

  onClickClear = () => {
    this.setState({taskList: []})
    localStorage.removeItem('taskList')
  }

  handleDropdownChange = event => {
    const sortBy = event.target.value
    this.sortMovies(sortBy)
    this.setState({sortBy})
  }

  render() {
    const {
      inputTitle,
      inputTag,
      taskList,
      inputDescription,
      inputImage,
      activeTag,
      sortBy,
      rating,
    } = this.state

    localStorage.setItem('taskList', JSON.stringify(taskList))
    const filterTaskList =
      activeTag === 'INITIAL'
        ? taskList
        : taskList.filter(each => each.tag === activeTag)

    return (
      <div className="app-container">
        <div className="my-movie-container">
          <h1>My Movies</h1>
          <ul className="lang-list">
            {tagsList.map(each => {
              const active = activeTag === each.optionId
              const isActive = active ? 'activate' : 'not-activate'
              return (
                <li key={each.optionId}>
                  <button
                    type="button"
                    value={each.optionId}
                    onClick={this.onClickActiveTag}
                    className={isActive}
                  >
                    {each.displayText}
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="title-rating-container">
            <select
              id="sort-by"
              name="sort-by"
              value={sortBy}
              onChange={this.handleDropdownChange}
            >
              <option value="titleAscending">Title (A-Z)</option>
              <option value="titleDescending">Title (Z-A)</option>
            </select>
            <select
              id="sort-by"
              name="sort-by"
              value={sortBy}
              onChange={this.handleDropdownChange}
            >
              <option value="ratingAscending">Rating (Low to High)</option>
              <option value="ratingDescending">Rating (High to Low)</option>
            </select>
          </div>
          <ul className="movies-list">
            {filterTaskList.map(each => (
              <li key={each.id} className="title-img-list">
                <div className="title-section">
                  <img src={each.image} className="image" alt="img" />
                  <div>
                    <p className="title-name">{each.title}</p>
                    <p>{each.description}</p>
                  </div>
                </div>
                <div>
                  <StarRatingComponent
                    name="rate1"
                    starCount={5}
                    value={each.rate}
                    onStarClick={this.onStarClick}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <form className="form-container" onSubmit={this.submitForm}>
          <h1 className="form-heading">Movie form</h1>
          <div className="form">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className="input"
              onChange={this.changeInputTitle}
              value={inputTitle}
            />
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              className="input-des"
              onChange={this.changeInputDescription}
              value={inputDescription}
            />
            <label htmlFor="image">Image Url</label>
            <input
              type="text"
              id="image"
              className="input"
              onChange={this.changeInputImage}
              value={inputImage}
            />
            <label htmlFor="file" className="file-label">
              OR
            </label>
            <input
              type="file"
              id="file"
              name="filename"
              onChange={this.changeInputImage}
            />
          </div>
          <div className="rating">
            <p className="rate">Rating</p>
            <StarRatingComponent
              name="rate1"
              starCount={5}
              value={rating}
              onStarClick={this.onStarClick}
            />
          </div>

          <label htmlFor="language" className="lang">
            Language
          </label>
          <select
            name="language"
            id="language"
            onChange={this.onChangeTag}
            value={inputTag}
          >
            <option value="">select lang</option>
            {tagsList.map(each => (
              <option value={each.optionId} key={each.optionId}>
                {each.displayText}
              </option>
            ))}
          </select>
          <div className="button-container">
            <button
              type="button"
              className="button"
              onClick={this.onClickClear}
            >
              Clear
            </button>
            <button type="submit" className="button">
              Save
            </button>
          </div>
        </form>
      </div>
    )
  }
}
export default MiniImdb
