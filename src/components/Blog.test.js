import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

describe('<Blog />', () => {
  let div, component, updateMockHandler

  beforeEach(() => {
    const blog = {
      title: 'Little neat trick to capture a click outside React component',
      author:'Pitipat Srichairat',
      url:'https://medium.com/@pitipatdop/little-neat-trick-to-capture-click-outside-with-react-hook-ba77c37c7e82',
      likes: 1800,
      user: {
        id: '5f2d20799fda773d243e0f9b',
        name: 'Mintu Rao',
        username: 'mira'
      }
    }

    const user = {
      //Skipping the fields that are not involved
      username: 'mira'
    }

    const mockHandler = jest.fn()
    updateMockHandler = jest.fn()

    component = render(
      <Blog blog={blog} user={user} updateBlog={updateMockHandler} deleteBlog={mockHandler} />
    )

    div = component.container.querySelector('.blog')
  })


  test('renders content', () => {

    expect(div).toHaveTextContent(
      'Little neat trick to capture a click outside React component'
    )
    expect(div).toHaveTextContent(
      'Pitipat Srichairat'
    )
    expect(div).not.toHaveTextContent(
      'https://medium.com/@pitipatdop/little-neat-trick-to-capture-click-outside-with-react-hook-ba77c37c7e82'
    )
    expect(div).not.toHaveTextContent(
      '1800'
    )
  })

  test('shows url and likes when view button is clicked', () => {

    console.log(prettyDOM(div))

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(div).toHaveTextContent(
      'https://medium.com/@pitipatdop/little-neat-trick-to-capture-click-outside-with-react-hook-ba77c37c7e82'
    )
    expect(div).toHaveTextContent(
      '1800'
    )
  })

  test('the update handler is called as many times as the likes button is clicked', () => {

    const view = component.getByText('view')
    fireEvent.click(view)
    const like = component.getByText('like')
    fireEvent.click(like)
    fireEvent.click(like)

    expect(updateMockHandler.mock.calls).toHaveLength(2)

  })

})