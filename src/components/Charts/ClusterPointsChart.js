import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p><strong>{point.clusterLabel}</strong></p>
        <p>Հերթական համար: {point.index}</p>
        <p>Որակի պրոգրեսս: {point.progress.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const ClusterProgressChart = ({ clusters }) => {
  // Для каждого кластера создаём данные с прогрессией качества
  const clusterLines = clusters.map((cluster, clusterIndex) => {
    // Сортируем точки по индексу
    const sortedPoints = [...cluster.points].sort((a, b) => a.index - b.index);

    // Кол-во точек для прогрессии
    const n = sortedPoints.length;

    // Создаём массив прогрессии от 0 до качества кластера
    const data = sortedPoints.map((point, i) => ({
      index: point.index,
      clusterLabel: cluster.label,
      progress: ((i + 1) / n) * cluster.quality,  // линейный рост
      color: colors[clusterIndex % colors.length],
    }));

    return {
      id: cluster.id,
      label: cluster.label,
      color: colors[clusterIndex % colors.length],
      data,
    };
  });

  // Максимальный индекс для оси X
  const maxX = Math.max(...clusterLines.flatMap(line => line.data.map(p => p.index)));

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          data={[]}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="index"
            domain={[0, maxX]}
            label={{ position: 'insideBottomRight' }}
            allowDecimals={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(tick) => `${tick}%`}
            label={{ angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {clusterLines.map(line => (
            <Line
              key={line.id}
              data={line.data}
              dataKey="progress"
              name={line.label}
              stroke={line.color}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClusterProgressChart;
