import { Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-50 w-[295px] h-[470px] px-4 m-2"
    >
      <br />
      <Skeleton
        width={180}
        height={200}
        variant="rectangular"
        className="ml-12 rounded-xl"
      />
      <br />
      <Skeleton width={250} height={20} variant="rectangular" />
      <br />
      <Skeleton width={250} height={20} variant="rectangular" />
      <br />
      <Skeleton width={250} height={20} variant="rectangular" />
      <br />
      <Skeleton width={150} height={30} variant="rectangular" />
    </motion.div>
  );
}
