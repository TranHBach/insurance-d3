const circleRadius = 7;
const padding = { right: 200, top: 50 };
const spaceBetweenLegend = 20;
const textMarginLeft = 20;

const ColorLegend = ({ colorLegendData, height, width, color, setFocus }) => {
  return (
    <g
      className="color-legend"
      transform={`translate(${width - padding.right}, ${padding.top})`}
    >
      <text x={"0.71em"} className="color-legend-title">
        Color Legend
      </text>
      {colorLegendData.map((d, i) => (
        <g
          key={i}
          transform={`translate(0, ${(i + 1) * spaceBetweenLegend})`}
          onMouseEnter={setFocus.bind(null, { [d.title]: true })}
          onMouseLeave={setFocus.bind(null, null)}
        >
          <circle
            cx={0}
            cy={0}
            r={circleRadius}
            fill={d.color ? d.color : color}
            opacity={d.opacity}
          />
          <text x={textMarginLeft} dy=".32em">
            {d.title}
          </text>
        </g>
      ))}
    </g>
  );
};

export default ColorLegend;
