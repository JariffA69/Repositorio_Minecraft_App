import React, { createContext, useState, useCallback } from 'react';

export const RenderContext = createContext();

export const RenderProvider = ({ children }) => {
  const [renderItems, setRenderItems] = useState([]);

  const addItemToRender = useCallback((item) => {
    setRenderItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItemFromRender = useCallback((itemId) => {
    setRenderItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const clearRenderItems = useCallback(() => {
    setRenderItems([]);
  }, []);

  return (
    <RenderContext.Provider 
      value={{ 
        renderItems, 
        addItemToRender, 
        removeItemFromRender, 
        clearRenderItems 
      }}
    >
      {children}
    </RenderContext.Provider>
  );
};

export const useRenderItems = () => {
  const context = React.useContext(RenderContext);
  if (!context) {
    throw new Error('useRenderItems must be used within RenderProvider');
  }
  return context;
};
