const rectWidth = 800;
const rectHeight = 15;
const padding = { left: 50, bottom: 50 };

const NewColorLegend = ({ width, height, color, opacityScale, noData }) => {
  return (
    <g transform={`translate(${padding.left}, ${height - padding.bottom})`}>
      <linearGradient id="linear">
        <stop className="stop1" offset="0%" stopColor="white" />
        <stop className="stop2" offset="100%" stopColor={color} />
      </linearGradient>
      <rect
        width={rectWidth}
        height={rectHeight}
        fill="url(#linear)"
        stroke="black"
      />
      {opacityScale.ticks().map((tick, i) => {
        let xLocation = opacityScale.range([0, rectWidth])(tick);
        return (
          <g transform={`translate(${xLocation}, 0)`}>
            <line key={i} y1={0} x1={0} y2={rectHeight} x2={0} stroke="black" />
            <text y={rectHeight + 15} textAnchor="middle">
              {tick}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default NewColorLegend;
