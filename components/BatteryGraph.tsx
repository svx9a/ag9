import React from 'react';

interface BatteryGraphProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

const BatteryGraph: React.FC<BatteryGraphProps> = ({ 
  data, 
  color = '#22d3ee', 
  width = 100, 
  height = 30 
}) => {
  if (!data || data.length === 0) return null;

  const max = 100;
  const min = 0;
  const range = max - min;
  
  // Create points for SVG path
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Line */}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Area under line (optional, for style) */}
      <polygon
        fill={color}
        fillOpacity="0.1"
        points={`0,${height} ${points} ${width},${height}`}
      />
    </svg>
  );
};

export default BatteryGraph;