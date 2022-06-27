import {
  line,
  max,
  scaleLinear,
  extent,
  curveNatural,
  min,
  brushX,
  select,
} from "d3";
import { useRef } from "react";
import AgeAxis from "./AgeAxis";
import AverageAxis from "./AverageAxis";

const averageValue = (d) => d.average;
const ageValue = (d) => d.age;
const chartWidth = 800;
const chartHeight = 200;
const padding = { left: 80, bottom: 500 };

const AgeLineChart = ({ data, height, setFiltered }) => {
  // Create brush for line chart
  const brush = brushX().extent([
    [0, 0],
    [chartWidth, chartHeight],
  ]);

  const brushRef = useRef();

  brush(select(brushRef.current));

  // Scale for age
  const ageScale = scaleLinear()
    .domain(extent(data, ageValue))
    .range([0, chartWidth])
    .nice();

  // Scale for average spending
  const averageScale = scaleLinear()
    .domain([0, max(data, averageValue)])
    .range([chartHeight, 0])
    .nice();
  brush.on("brush end", (event) => {
    if (event.selection) {
      let start = ageScale.invert(event.selection[0]);
      let end = ageScale.invert(event.selection[1]);
      setFiltered({ start, end });
    } else {
      setFiltered(null);
    }
  });

  return (
    <g transform={`translate(${padding.left},${height - padding.bottom})`}>
      <AverageAxis
        averageScale={averageScale}
        height={chartHeight}
        width={chartWidth}
      />
      <AgeAxis ageScale={ageScale} height={chartHeight} width={chartWidth} />
      <g ref={brushRef}>
        <path
          className="line-chart"
          fill="none"
          stroke="black"
          d={line()
            .x((d) => ageScale(ageValue(d)))
            .y((d) => averageScale(averageValue(d)))
            .curve(curveNatural)(data)}
        />
      </g>
    </g>
  );
};

export default AgeLineChart;
