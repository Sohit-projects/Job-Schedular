import React from 'react';

const MessageAlert = ({ message }) => {
  if (!message.text) return null;

  return (
    <div className={`${message.type === 'error' ? 'error-message' : 'success-message'}`}>
      {message.text}
    </div>
  );
};

export default MessageAlert;