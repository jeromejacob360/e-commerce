import { AnimatePresence, motion } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export function InputVerifier({
  condition1,
  condition2,
  length,
  reqLength = 10,
  endOffset = 0,
}) {
  return (
    <>
      <AnimatePresence>
        {!condition1 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, x: 10, transition: { duration: 0.3 } }}
            className={`absolute ${endOffset ? endOffset : 'right-2'} text-sm`}
          >{`${length || 0}/${reqLength}`}</motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {condition2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5 },
            }}
            exit={{ opacity: 0, x: -10 }}
            className={`text-green-600 absolute  ${
              endOffset ? endOffset : 'right-2'
            }`}
          >
            <CheckCircleOutlineIcon />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function InputTick({ condition }) {
  return (
    <AnimatePresence>
      {condition && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5 },
          }}
          exit={{
            opacity: 0,
            scale: 0,
            transition: { duration: 0.5 },
          }}
          className={`text-green-600 absolute right-2`}
        >
          <CheckCircleOutlineIcon />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
