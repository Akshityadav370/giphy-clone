import { GiphyFetch } from '@giphy/js-fetch-api';
import { createContext } from 'react';
import { useState } from 'react';
import React from 'react';
import { useContext } from 'react';

const GifyContext = createContext();

const GifyContextProvider = ({ children }) => {
  const [gifs, setGifs] = useState();
  const [filter, setFilter] = useState();
  const [favorites, setFavorites] = useState();

  const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_KEY);

  return (
    <GifyContext.Provider
      value={{ gf, gifs, setGifs, favorites, setFavorites, filter, setFilter }}
    >
      {children}
    </GifyContext.Provider>
  );
};

export const GifyContextState = () => {
  return useContext(GifyContext);
};

export default GifyContextProvider;
