const AgeAxis = ({ ageScale, height, chartHeight }) => {
  console.log(height);
  return (
    <g className="axis" transform={`translate(0, ${height + chartHeight})`}>
      <line y2={height} />
      {ageScale.ticks().map((tick, i) => (
        <g key={i} transform={`translate(${ageScale(tick)}, ${-height})`}>
          <line y2={-height} />
          <text
            textAnchor="middle"
            dy={".71em"}
            y={6}
            stroke="#ced4da"
            strokeWidth={0.2}
          >
            {tick}
          </text>
        </g>
      ))}
    </g>
  );
};

export default AgeAxis;
