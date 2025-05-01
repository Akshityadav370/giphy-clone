import { GiphyFetch } from '@giphy/js-fetch-api';
import { createContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import { useContext } from 'react';

const GifyContext = createContext();

const GifyContextProvider = ({ children }) => {
  const [gifs, setGifs] = useState([]);
  const [filter, setFilter] = useState('gifs');
  const [favorites, setFavorites] = useState([]);

  const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_KEY);

  const addToFavorites = (id) => {
    if (favorites.includes(id)) {
      const updatedFavorites = favorites.filter((itemId) => itemId !== id);
      localStorage.setItem('favoriteGIFs', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } else {
      const updatedFavorites = [...favorites];
      updatedFavorites.push(id);
      localStorage.setItem('favoriteGIFs', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    }
  };

  useEffect(() => {
    const favoritesFromLS =
      JSON.parse(localStorage.getItem('favoriteGIFs')) || [];

    setFavorites(favoritesFromLS);
  }, []);

  return (
    <GifyContext.Provider
      value={{
        gf,
        gifs,
        setGifs,
        favorites,
        setFavorites,
        filter,
        setFilter,
        addToFavorites,
      }}
    >
      {children}
    </GifyContext.Provider>
  );
};

export const GifyContextState = () => {
  return useContext(GifyContext);
};

export default GifyContextProvider;
