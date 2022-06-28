import {
  line,
  max,
  scaleLinear,
  extent,
  curveNatural,
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
const padding = { left: 100, bottom: 300 };

const AgeLineChart = ({
  color,
  data,
  height,
  setFiltered,
  smoker,
  nonSmoker,
  male,
  female,
  focus,
}) => {
  console.log(female)
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

  // Find max value in the chart
  let maxValue = 0;
  maxValue =
    maxValue > max(smoker, averageValue) ? maxValue : max(smoker, averageValue);
  maxValue =
    maxValue > max(nonSmoker, averageValue)
      ? maxValue
      : max(nonSmoker, averageValue);
  maxValue =
    maxValue > max(male, averageValue) ? maxValue : max(male, averageValue);
  maxValue =
    maxValue > max(female, averageValue) ? maxValue : max(female, averageValue);

  // Scale for calculating y-axis ticks
  const tempScale = scaleLinear()
    .domain([0, maxValue])
    .range([chartHeight, 0])
    .nice();

  const actualChartHeight = averageScale(tempScale.ticks().at(-1));

  tempScale.range([chartHeight, actualChartHeight]);
  // Create brush for line chart
  const brush = brushX().extent([
    [0, actualChartHeight],
    [chartWidth, chartHeight],
  ]);

  const brushRef = useRef();

  brush(select(brushRef.current));

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
        averageScale={tempScale}
        height={actualChartHeight}
        width={chartWidth}
      />
      <AgeAxis
        ageScale={ageScale}
        chartHeight={chartHeight}
        height={chartHeight - actualChartHeight}
        width={chartWidth}
      />
      <text
        className="axis-title"
        textAnchor="middle"
        x={chartWidth / 2}
        y={chartHeight + 40}
      >
        Age
      </text>
      <text
        className="axis-title"
        textAnchor="middle"
        transform={`rotate(-90)`}
        y={-65}
      >
        Medical Spending
      </text>
      <g ref={brushRef}>
        <path
          className="line-chart"
          fill="none"
          stroke={color.find(element => element.title === "All").color}
          d={line()
            .x((d) => ageScale(ageValue(d)))
            .y((d) => averageScale(averageValue(d)))
            .curve(curveNatural)(data)}
          opacity={focus && !focus["All"] ? 0.2 : 1}
        />
      </g>
      <g>
        {/* Smoker */}
        <path
          className="line-chart"
          fill="none"
          stroke={color.find(element => element.title === "Smoker").color}
          d={line()
            .x((d) => ageScale(ageValue(d)))
            .y((d) => averageScale(averageValue(d)))
            .curve(curveNatural)(smoker)}
          opacity={focus && !focus["Smoker"] ? 0.2 : 1}
        />

        {/* Non-Smoker */}
        <path
          className="line-chart"
          fill="none"
          stroke={color.find(element => element.title === "Non-Smoker").color}
          d={line()
            .x((d) => ageScale(ageValue(d)))
            .y((d) => averageScale(averageValue(d)))
            .curve(curveNatural)(nonSmoker)}
          opacity={focus && !focus["Non-Smoker"] ? 0.2 : 1}
        />

        {/* Male */}
        <path
          className="line-chart"
          fill="none"
          stroke={color.find(element => element.title === "Male").color}
          d={line()
            .x((d) => ageScale(ageValue(d)))
            .y((d) => averageScale(averageValue(d)))
            .curve(curveNatural)(male)}
          opacity={focus && !focus["Male"] ? 0.2 : 1}
        />

        {/* Female */}
        <path
          className="line-chart"
          fill="none"
          stroke={color.find(element => element.title === "Female").color}
          d={line()
            .x((d) => ageScale(ageValue(d)))
            .y((d) => averageScale(averageValue(d)))
            .curve(curveNatural)(female)}
          opacity={focus && !focus["Female"] ? 0.2 : 1}
          z={9999}
        />
      </g>
    </g>
  );
};

export default AgeLineChart;
