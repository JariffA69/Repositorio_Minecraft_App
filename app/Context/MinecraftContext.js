import React, { createContext, useState, useEffect } from 'react';
import { getAllItems } from '../utils/minecraftApi';

export const MinecraftContext = createContext();

export const MinecraftProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await getAllItems();
        setItems(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <MinecraftContext.Provider value={{ items, loading, error }}>
      {children}
    </MinecraftContext.Provider>
  );
};

export const useMinecraftItems = () => {
  const context = React.useContext(MinecraftContext);
  if (!context) {
    throw new Error('useMinecraftItems must be used within MinecraftProvider');
  }
  return context;
};
