import { useState } from "react";

const tooltipRectWidth = 85;
const tooltipRectHeight = 25;
const tooltipColor = "#74c0fc";
const textColor = "#1864ab";

const Tooltip = ({ data, clientX, clientY, format }) => {
  return (
    <g transform={`translate(${clientX}, ${clientY - 35})`}>
      <rect
        x="10"
        y="0"
        height={tooltipRectHeight}
        width={tooltipRectWidth}
        style={{ fill: tooltipColor }}
      />
      <text x="15" y="18" stroke={textColor}>
        {isNaN(format(data)) ? "No Data": format(data)}
      </text>
      <polygon points="0,35 10,25 45,25" style={{ fill: "#74c0fc" }} />
    </g>
  );
};

export default Tooltip;
