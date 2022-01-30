import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

export default function HomeLoader({ showBrandPage }) {
  return (
    <AnimatePresence>
      {showBrandPage && (
        <motion.div
          exit={{
            height: 0,
            transition: { duration: 0.5 },
          }}
          className="fixed inset-0 z-10 grid w-full h-full bg-gray-100 place-items-center"
        >
          <div className="flex text-3xl text-orange-600 sm:text-5xl">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.5 } }}
            >
              THE SHOE STORE
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
