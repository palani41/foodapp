import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let socketInstance;

    if (user) {
      const serverUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace('/api', '') 
        : 'http://localhost:5001';

      socketInstance = io(serverUrl, {
        withCredentials: true
      });

      socketInstance.on('connect', () => {
        console.log('Connected to WebSocket server');
        
        // Join personal user room
        socketInstance.emit('join', user._id);
        
        // Join role room
        if (user.role === 'admin' || user.role === 'delivery') {
          socketInstance.emit('joinRole', user.role);
        }
      });

      setSocket(socketInstance);
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
