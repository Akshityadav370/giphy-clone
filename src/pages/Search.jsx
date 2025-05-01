import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import FilterGif from '../components/FilterGif';
import Gif from '../components/Gif';
import { GifyContextState } from '../context/GifyContext';

export const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const { query } = useParams();

  const { gf, filter } = GifyContextState();

  const fetchSearchResults = async () => {
    const { data } = await gf.search(query, {
      sort: 'relevant',
      lang: 'en',
      type: filter,
      limit: 20,
    });

    setSearchResults(data);
  };

  useEffect(() => {
    fetchSearchResults();
  }, [filter, query]);

  return (
    <div className='my-4'>
      <h2 className='text-5xl pb-3 font-extrabold'>{query}</h2>
      <FilterGif alignLeft={true} />
      {searchResults.length > 0 ? (
        <div className='columns-2 md:columns-3 lg:columns-4 gap-2'>
          {searchResults.map((gif) => (
            <Gif gif={gif} key={gif.id} />
          ))}
        </div>
      ) : (
        <div className='flex h-96'>
          <span className='m-auto justify-center'>
            No GIFs found for {query}. Try searching for Stickers instead?
          </span>
        </div>
      )}
    </div>
  );
};

export default Search;
