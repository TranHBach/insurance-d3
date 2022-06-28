import { useMemo } from "react";

const rectWidth = 800;
const rectHeight = 15;
const padding = { left: 100, bottom: 565 };

const NewColorLegend = ({ width, height, color, opacityScale, noData }) => {
  // Use memo tested
  const returnValue = useMemo(() => {
    console.log("render new color legend")
    return(
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
        let xLocation = opacityScale(tick);
        return (
          // Multiple by rectwidth to render the lines
          <g key={i} transform={`translate(${xLocation * rectWidth}, 0)`}>
            <line y1={0} x1={0} y2={rectHeight} x2={0} stroke="black" />
            <text y={rectHeight + 15} textAnchor="middle">
              {tick}
            </text>
          </g>
        );
      })}
    </g>
  )}, [color, height, opacityScale])
  return returnValue
};

export default NewColorLegend;
