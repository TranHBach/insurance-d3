const AverageAxis = ({ averageScale, height, width }) => {
  return (
    <g className="axis">
      <line y1={height} y2={height} x2={width} />
      {averageScale.ticks(5).map((tick, i) => (
        <g key={i} transform={`translate(0, ${averageScale(tick)})`}>
          <line x2={width} />
          <text textAnchor="end" dy={".32em"} x={-6} stroke="black" strokeWidth={.2}>
            {tick}
          </text>
        </g>
      ))}
    </g>
  );
};

export default AverageAxis;
