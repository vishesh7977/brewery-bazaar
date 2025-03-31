
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "./loading-spinner";

interface PageLoaderProps {
  loading?: boolean;
}

export function PageLoader({ loading = true }: PageLoaderProps) {
  const [isVisible, setIsVisible] = useState(loading);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 500); // Wait a bit before hiding to complete animation
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <LoadingSpinner size="lg" />
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 font-medium text-primary"
            >
              BREWERY
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
