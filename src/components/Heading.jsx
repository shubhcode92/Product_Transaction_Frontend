import React from 'react';

const Heading = ({ val = 'shubhcode92' }) => {
  return (
    <div className='text-center mt-10 md:mt-20 mb-8 text-orange-500 text-2xl font-bold border-[1px] border-orange-500 mx-4 md:mx-72 py-4 rounded-md bg-slate-600'>
      <h1>{val}</h1>
    </div>
  );
};

export default Heading;







