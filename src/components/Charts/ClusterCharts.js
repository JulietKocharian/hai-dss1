import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p><strong>{data.label}</strong></p>
        <p>Որակը: {data.quality}%</p>
      </div>
    );
  }
  return null;
};

const ClusterCharts = ({ clusters }) => {
  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      <h4 className="text-xl font-bold mb-4">📈 Կլաստերների վիզուալ ներկայացում</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={clusters}>
          <XAxis dataKey="label" />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(tick) => `${tick}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="quality" fill="#8884d8">
            {clusters.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClusterCharts;
