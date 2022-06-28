import { useMemo } from "react";
const circleRadius = 7;
const spaceBetweenLegend = 20;
const textMarginLeft = 20;

const ColorLegend = ({
  colorLegendData,
  width,
  color,
  setFocus,
  padding,
  click,
  focus,
}) => {
  // Use memo tested
  const returnValue = useMemo(() => {
    console.log(colorLegendData);
    console.log("render color legend");
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
            onClick={
              click
                ? setFocus.bind(
                    null,
                    focus && focus[d.title] ? null : { [d.title]: true }
                  )
                : () => {}
            }
            onMouseEnter={
              !click ? setFocus.bind(null, { [d.title]: true }) : () => {}
            }
            onMouseLeave={!click ? setFocus.bind(null, null) : () => {}}
          >
            {click && focus && focus[d.title] && (
              <rect
                height={20}
                width={135}
                fill="black"
                opacity={0.1}
                x={"-.64em"}
                y={"-.64em"}
                rx="3"
              />
            )}
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
  }, [color, colorLegendData, setFocus, width, padding, click, focus]);
  return returnValue;
};

export default ColorLegend;
