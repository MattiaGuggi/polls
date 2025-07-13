"use client";
import { motion } from "framer-motion";

const AnimatedContainer = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
    className="w-full flex-1 flex flex-col items-center justify-center"
  >
    {children}
  </motion.div>
);

export default AnimatedContainer;
