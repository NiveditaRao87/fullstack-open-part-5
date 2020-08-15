import React from 'react'
import './Notification.css'
import PropTypes from 'prop-types'

const Notification = ({ notification }) => {
    
    const {message,type} = notification
    
    if (message === null) {
      return null
    }
  
    return (
      <div className={`notification ${type}`}>
        {message}
      </div>
    )
  }

Notification.propTypes = {
  notification: PropTypes.object.isRequired
}
  
export default Notification