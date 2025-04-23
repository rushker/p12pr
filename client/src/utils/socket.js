// client/src/utils/socket.js
import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (token) => {
  if (!socket && token) {
    socket = io(process.env.REACT_APP_API_BASE_URL.replace('/api',''), {
      auth: { token },
      withCredentials: true,
    });
  }
  return socket;
};

export const getSocket = () => socket;
