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

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border rounded shadow">
                <p><strong>Հերթական համար: {label}</strong></p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {entry.value?.toFixed(1)}%
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Тестовые данные
const testClusters = [
    {
        id: 1,
        label: "Կլաստեր 1",
        quality: 85,
        points: [
            { x: 10, y: 15, index: 1 },
            { x: 12, y: 18, index: 3 },
            { x: 8, y: 13, index: 5 },
            { x: 11, y: 16, index: 7 },
        ]
    },
    {
        id: 2,
        label: "Կլաստեր 2",
        quality: 72,
        points: [
            { x: 25, y: 30, index: 2 },
            { x: 28, y: 32, index: 4 },
            { x: 23, y: 28, index: 6 },
            { x: 26, y: 31, index: 8 },
        ]
    },
    {
        id: 3,
        label: "Կլաստեր 3",
        quality: 91,
        points: [
            { x: 40, y: 20, index: 1 },
            { x: 42, y: 22, index: 3 },
            { x: 38, y: 18, index: 5 },
            { x: 41, y: 21, index: 9 },
        ]
    }
];

const ClusterProgressChart = ({ clusters = testClusters }) => {
    // Получаем все уникальные индексы
    const allIndices = [...new Set(
        clusters.flatMap(cluster => cluster.points.map(p => p.index))
    )].sort((a, b) => a - b);

    // Создаем данные для LineChart
    const chartData = allIndices.map(index => {
        const dataPoint = { index };

        clusters.forEach((cluster, clusterIndex) => {
            // Находим все точки кластера до текущего индекса (включительно)
            const clusterPoints = cluster.points
                .filter(p => p.index <= index)
                .sort((a, b) => a.index - b.index);

            if (clusterPoints.length > 0) {
                // Рассчитываем прогресс: количество точек / общее количество точек * качество
                const progress = (clusterPoints.length / cluster.points.length) * cluster.quality;
                dataPoint[`cluster_${cluster.id}`] = progress;
            }
        });

        return dataPoint;
    });

    return (
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="index"
                        label={{ position: 'insideBottomRight', offset: -10 }}
                        allowDecimals={false}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tickFormatter={(tick) => `${tick}%`}
                        label={{ angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />

                    {clusters.map((cluster, index) => (
                        <Line
                            key={cluster.id}
                            type="monotone"
                            dataKey={`cluster_${cluster.id}`}
                            name={cluster.label}
                            stroke={colors[index % colors.length]}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            connectNulls={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ClusterProgressChart