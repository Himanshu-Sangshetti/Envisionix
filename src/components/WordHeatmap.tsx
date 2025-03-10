import { motion } from "framer-motion";

interface WordHeatmapProps {
  words: { word: string; importance: number; reason: string }[];
}

export function WordHeatmap({ words }: WordHeatmapProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {words.map((item, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          style={{
            backgroundColor: `rgba(59, 130, 246, ${item.importance * 0.5})`,
            padding: '2px 4px',
            borderRadius: '4px',
            color: item.importance > 0.6 ? 'white' : 'inherit'
          }}
        >
          {item.word}
        </motion.span>
      ))}
    </div>
  );
}
