import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import FilterGif from '../components/FilterGif';
import Gif from '../components/Gif';
import { GifyContextState } from '../context/GifyContext';

export const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { query } = useParams();
  const observer = useRef();

  const { gf, filter } = GifyContextState();

  const LIMIT = 20;

  const fetchSearchResults = async (resetResults = false) => {
    try {
      setLoading(true);
      const { data, pagination } = await gf.search(query, {
        sort: 'relevant',
        lang: 'en',
        type: filter,
        limit: LIMIT,
        offset: resetResults ? 0 : offset,
      });

      if (resetResults) {
        setSearchResults(data);
        setOffset(LIMIT);
      } else {
        setSearchResults((prev) => [...prev, ...data]);
        setOffset((prev) => prev + LIMIT);
      }

      setHasMore(pagination.total_count > offset + LIMIT);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    fetchSearchResults(true);
  }, [filter, query]);

  const lastGifElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchSearchResults();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, query, filter]
  );

  return (
    <div className='my-4'>
      <h2 className='text-5xl pb-3 font-extrabold'>{query}</h2>
      <FilterGif alignLeft={true} />

      {searchResults.length > 0 ? (
        <>
          <div className='columns-2 md:columns-3 lg:columns-4 gap-2'>
            {searchResults.map((gif, index) => {
              if (searchResults.length === index + 1) {
                return (
                  <div ref={lastGifElementRef} key={gif.id}>
                    <Gif gif={gif} />
                  </div>
                );
              } else {
                return <Gif gif={gif} key={gif.id} />;
              }
            })}
          </div>

          {loading && (
            <div className='flex justify-center my-4'>
              <div className='loader'></div>
            </div>
          )}

          {!hasMore && searchResults.length > 0 && (
            <p className='text-center my-4 text-gray-400'>
              No more results to load
            </p>
          )}
        </>
      ) : (
        !loading && (
          <div className='flex h-96'>
            <span className='m-auto justify-center'>
              No GIFs found for {query}. Try searching for Stickers instead?
            </span>
          </div>
        )
      )}
    </div>
  );
};

export default Search;
