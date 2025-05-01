import React from 'react';
import { FaLinkedin } from 'react-icons/fa';

const FollowOn = () => {
  return (
    <div className='faded-text pt-2'>
      <span>Follow on:</span>
      <div className='flex gap-4 pt-3'>
        <a href='https://www.linkedin.com/in/akshit-yadav/'>
          <FaLinkedin size={20} />
        </a>
        <a href='https://www.linkedin.com/in/akshit-yadav/'>
          <FaLinkedin size={20} />
        </a>
      </div>
    </div>
  );
};

export default FollowOn;
