import React from 'react';

export default function PageTitle({ title }) {
  return (
    <div className="flex justify-center mx-auto max-w-screen-2xl uppercase">
      <h1 className="px-8 pb-2 sm:my-10 my:4 text-3xl border-b">{title}</h1>
    </div>
  );
}
