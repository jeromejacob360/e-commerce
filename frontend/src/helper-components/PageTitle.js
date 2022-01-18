import React from 'react';
import Metadata from './metadata';

export default function PageTitle({ title }) {
  return (
    <div className="flex justify-center mx-auto uppercase max-w-screen-2xl">
      <Metadata title={title} />
      <h1 className="px-8 pb-2 text-3xl border-b sm:my-10 my:4">{title}</h1>
    </div>
  );
}
