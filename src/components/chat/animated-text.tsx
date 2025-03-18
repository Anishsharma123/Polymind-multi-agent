import { motion } from 'framer-motion'

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {text}
    </motion.p>
  );
} 