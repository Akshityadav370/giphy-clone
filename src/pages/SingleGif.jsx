import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { HiOutlineExternalLink } from 'react-icons/hi';
import {
  HiMiniChevronDown,
  HiMiniChevronUp,
  HiMiniHeart,
} from 'react-icons/hi2';
import { FaPaperPlane } from 'react-icons/fa6';
import { IoCodeSharp } from 'react-icons/io5';
import Gif from '../components/Gif';
import FollowOn from '../components/FollowOn';
import { GifyContextState } from '../context/GifyContext';

const contentType = ['gifs', 'stickers', 'texts'];

const SingleGif = () => {
  const { type, slug } = useParams();
  const [gif, setGif] = useState({});
  const [relatedGifs, setRelatedGifs] = useState([]);
  const [readMore, setReadMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [gifId, setGifId] = useState('');
  const observer = useRef();

  const { gf, addToFavorites, favorites } = GifyContextState();

  const LIMIT = 10;

  const fetchRelatedGifs = async (id, resetGifs = false) => {
    try {
      setLoading(true);
      const { data, pagination } = await gf.related(id, {
        limit: LIMIT,
        offset: resetGifs ? 0 : offset,
      });

      if (resetGifs) {
        setRelatedGifs(data);
        setOffset(LIMIT);
      } else {
        setRelatedGifs((prev) => [...prev, ...data]);
        setOffset((prev) => prev + LIMIT);
      }

      setHasMore(pagination.total_count > offset + LIMIT);
    } catch (error) {
      console.error('Error fetching related gifs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!contentType.includes(type)) {
      throw new Error('Invalid Content Type');
    }

    const fetchGif = async () => {
      try {
        const idArray = slug.split('-');
        const id = idArray[idArray.length - 1];
        setGifId(id);

        const { data } = await gf.gif(id);
        setGif(data);

        fetchRelatedGifs(id, true);
      } catch (error) {
        console.error('Error fetching gif:', error);
      }
    };

    fetchGif();
  }, [type, slug]);

  const lastGifElementRef = useCallback(
    (node) => {
      if (loading || !gifId) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchRelatedGifs(gifId);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, gifId]
  );

  const shareGif = () => {
    // todo
  };

  const EmbedGif = () => {
    // todo
  };

  return (
    <div className='grid grid-cols-4 my-10 gap-4'>
      <div className='hidden sm:block'>
        {gif?.user && (
          <>
            <div className='flex gap-1'>
              <img
                src={gif?.user?.avatar_url}
                alt={gif?.user?.display_name}
                className='h-14'
              />
              <div className='px-2'>
                <div className='font-bold'>{gif?.user?.display_name}</div>
                <div className='faded-text'>@{gif?.user?.username}</div>
              </div>
            </div>
            {gif?.user?.description && (
              <>
                <p className='py-4 whitespace-pre-line text-sm text-gray-400'>
                  {readMore
                    ? gif?.user?.description
                    : gif?.user?.description.slice(0, 100) + '...'}
                </p>
                <div
                  className='flex items-center faded-text cursor-pointer'
                  onClick={() => setReadMore(!readMore)}
                >
                  {readMore ? (
                    <>
                      Read less <HiMiniChevronUp size={20} />
                    </>
                  ) : (
                    <>
                      Read more <HiMiniChevronDown size={20} />
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}
        <FollowOn />

        <div className='divider' />

        {gif?.source && (
          <div>
            <span className='faded-text'>Source</span>
            <div className='flex items-center text-sm font-bold gap-1'>
              <HiOutlineExternalLink size={25} />
              <a href={gif.source} target='_blank' className='truncate'>
                {gif.source}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className='col-span-4 sm:col-span-3'>
        <div className='flex gap-6'>
          <div className='w-full sm:w-3/4'>
            <div className='faded-text truncate mb-2'>{gif.title}</div>
            <Gif gif={gif} hover={false} />

            <div className='flex sm:hidden gap-1'>
              <img
                src={gif?.user?.avatar_url}
                alt={gif?.user?.display_name}
                className='h-14'
              />
              <div className='px-2'>
                <div className='font-bold'>{gif?.user?.display_name}</div>
                <div className='faded-text'>@{gif?.user?.username}</div>
              </div>

              <button className='ml-auto' onClick={shareGif}>
                <FaPaperPlane size={25} />
              </button>
            </div>
          </div>

          <div className='hidden sm:flex flex-col gap-5 mt-6'>
            <button
              onClick={() => addToFavorites(gif.id)}
              className='flex gap-5 items-center font-bold text-lg'
            >
              <HiMiniHeart
                size={30}
                className={`${
                  favorites.includes(gif.id) ? 'text-red-500' : ''
                }`}
              />
              Favorite
            </button>
            <button
              onClick={shareGif}
              className='flex gap-6 items-center font-bold text-lg'
            >
              <FaPaperPlane size={25} />
              Share
            </button>
            <button
              onClick={EmbedGif}
              className='flex gap-5 items-center font-bold text-lg'
            >
              <IoCodeSharp size={30} />
              Embed
            </button>
          </div>
        </div>

        <div>
          <span className='font-extrabold'>Related GIFs</span>
          <div className='columns-2 md:columns-3 gap-2'>
            {relatedGifs.length > 0 &&
              relatedGifs.map((relatedGif, index) => {
                if (relatedGifs.length === index + 1) {
                  return (
                    <div ref={lastGifElementRef} key={relatedGif.id}>
                      <Gif gif={relatedGif} />
                    </div>
                  );
                } else {
                  return <Gif gif={relatedGif} key={relatedGif.id} />;
                }
              })}
          </div>

          {loading && (
            <div className='flex justify-center my-4'>
              <div className='loader'></div>
            </div>
          )}

          {!hasMore && relatedGifs.length > 0 && (
            <p className='text-center my-4 text-gray-400'>
              No more related GIFs to load
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleGif;
