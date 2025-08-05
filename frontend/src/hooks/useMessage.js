import { useState } from 'react';

export const useMessage = () => {
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const clearMessage = () => {
    setMessage({ text: '', type: '' });
  };

  return { message, showMessage, clearMessage };
};