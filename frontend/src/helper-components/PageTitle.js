import React from 'react';
import Metadata from './Metadata';

export default function PageTitle({ title }) {
  return (
    <div className="flex justify-center mx-auto mb-8 uppercase">
      <Metadata title={title} />
      <h1 className="px-10 pb-2 text-3xl text-center border-b shadow-mdwhitespace-nowrap my:4">
        {title}
      </h1>
    </div>
  );
}
