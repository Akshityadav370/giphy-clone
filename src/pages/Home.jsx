import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GifyContextState } from '../context/GifyContext';
import FilterGif from '../components/FilterGif';
import Gif from '../components/Gif';

const Home = () => {
  const { gf, gifs, filter, setGifs } = GifyContextState();
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const LIMIT = 20;

  const fetchTrendingGifs = async (resetGifs = false) => {
    try {
      setLoading(true);
      const { data, pagination } = await gf.trending({
        limit: LIMIT,
        offset: resetGifs ? 0 : offset,
        type: filter,
        rating: 'g',
      });

      if (resetGifs) {
        setGifs(data);
        setOffset(LIMIT);
      } else {
        setGifs((prev) => [...prev, ...data]);
        setOffset((prev) => prev + LIMIT);
      }

      setHasMore(pagination.total_count > offset + LIMIT);
    } catch (error) {
      console.error('Error fetching trending gifs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    fetchTrendingGifs(true);
  }, [filter]);

  const lastGifElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchTrendingGifs();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div>
      <img
        src='/banner.gif'
        alt='earth banner'
        className='mt-2 rounded w-full'
      />

      <FilterGif showTrending />
      <div className='columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2'>
        {gifs.map((gif, index) => {
          if (gifs.length === index + 1) {
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

      {!hasMore && gifs.length > 0 && (
        <p className='text-center my-4 text-gray-400'>No more gifs to load</p>
      )}
    </div>
  );
};

export default Home;
