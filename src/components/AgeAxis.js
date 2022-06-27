const AgeAxis = ({ ageScale, height, width }) => {
  return (
    <g className="axis">
      <line y2={height}  />
      {ageScale.ticks().map((tick, i) => (
        <g key={i} transform={`translate(${ageScale(tick)}, ${height})`}>
          <line y2={-height} />
          <text textAnchor="middle" dy={".71em"} y={6} stroke="black" strokeWidth={.2}>
            {tick}
          </text>
        </g>
      ))}
    </g>
  );
};

export default AgeAxis;
