import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

export default function HomeLoader({ showPage }) {
  return (
    <AnimatePresence>
      {showPage && (
        <motion.div
          exit={{
            height: 0,
            transition: { duration: 0.5 },
          }}
          className="fixed inset-0 z-10 grid w-full h-full bg-white place-items-center"
        >
          <div className="flex text-5xl text-orange-600">
            <motion.h1
              initial={{ y: '100', opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{ delay: 0.8 }}
            >
              THE
            </motion.h1>
            <motion.h1
              initial={{ y: '100', opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{ delay: 1 }}
            >
              &nbsp;SHOE&nbsp;
            </motion.h1>
            <motion.h1
              initial={{ y: '100', opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{ delay: 1.2 }}
            >
              STORE
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
