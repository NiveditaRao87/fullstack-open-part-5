import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CreateForm from './CreateForm'

test('<CreateForm /> calls createBlog with all the correct details', () => {
  const createBlog = jest.fn()

  const { container } = render(
    <CreateForm createBlog={createBlog} />
  )

  const title = container.querySelector('#title')
  const author = container.querySelector('#author')
  const url = container.querySelector('#url')
  const form = container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'Backend development is easier than frontend development' }
  })
  fireEvent.change(author, {
    target: { value: 'Mira' }
  })
  fireEvent.change(url, {
    target: { value: 'https://thisurldoesnotexist.com' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Backend development is easier than frontend development')
  expect(createBlog.mock.calls[0][0].author).toBe('Mira')
  expect(createBlog.mock.calls[0][0].url).toBe('https://thisurldoesnotexist.com')

})