import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface WordImportanceTabProps {
  prompt: string;
  setSelectedWord: (word: string | null) => void;
  wordHeatmap: { word: string; importance: number; reason: string }[];
}

export function WordImportanceTab({
  prompt,
  setSelectedWord,
  wordHeatmap,
}: WordImportanceTabProps) {
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Word Importance',
        data: [] as number[],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  });

  useEffect(() => {
    const labels = wordHeatmap.map(item => item.word);
    const data = wordHeatmap.map(item => item.importance);
    
    setChartData({
      labels,
      datasets: [
        {
          label: 'Word Importance',
          data,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
        },
      ],
    });
  }, [wordHeatmap]);

  return (
    <motion.div
      key="importance-tab"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 p-6 bg-[#0A0F1D] rounded-lg shadow-lg"
    >
      <h3 className="text-lg font-medium mb-3">Word Importance Analysis</h3>
      <p className="text-sm opacity-70 mb-4">
        This section shows the importance of each word in your prompt. Hover over a bar to see its impact on the generated image.
      </p>
      
      {/* Interactive Bar Chart */}
      <div className="mb-6">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top' as const,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const word = context.label;
                    const importance = context.raw as number;
                    return `${word}: ${importance.toFixed(2)}`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Words',
                  color: '#ffffff',
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Importance Score',
                  color: '#ffffff',
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
                beginAtZero: true,
              },
            },
          }}
        />
      </div>

      {/* Word heatmap visualization */}
      <div className="flex flex-wrap gap-2 mb-6">
        {wordHeatmap.map((item, index) => (
          <motion.button
            key={index}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              item.importance > 0.6 ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{
              backgroundColor: `rgba(59, 130, 246, ${item.importance * 0.5})`,
              color: item.importance > 0.6 ? 'white' : 'inherit'
            }}
            onClick={() => setSelectedWord(item.word)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.word}
          </motion.button>
        ))}
      </div>

      {/* Display reasons for importance */}
      {wordHeatmap.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium">Reasons for Importance:</h4>
          <ul className="list-disc list-inside space-y-1">
            {wordHeatmap.map((item, index) => (
              <li key={index} className="text-sm opacity-70">
                <strong>{item.word}:</strong> {item.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}