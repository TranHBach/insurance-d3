import "./App.css";
import { bin, format, map as MAP, max, scalePow } from "d3";
import { geoPath, scaleOrdinal, schemeCategory10, interpolateReds } from "d3";
import { useUSAtlas } from "./hooks/useUSAtlas";
import { useStatesDivision } from "./hooks/useStatesDivision";
import { useData } from "./hooks/useData";
import ColorLegend from "./components/ColorLegend";
import { useState } from "react";
import NewColorLegend from "./components/NewColorLegend";
import Tooltip from "./components/ToolTip";

const height = 710;
const width = 1200;

// Color used for Division that have data
const availableDataColor = "#c92a2a";

const noDataColor = "#ced4da";

function App() {
  // Create hover effect
  const [focus, setFocus] = useState();

  // data of the tooltip
  const [tooltip, setTooltip] = useState();
  const data = useData();
  const atlas = useUSAtlas();

  // States filtered by its region (East, West, NorthEast, etc...)
  const statesDivision = useStatesDivision();

  if (!atlas || !statesDivision || !data) {
    return <p>Loading...</p>;
  }
  const path = geoPath();

  // List out all the region in the dataset
  const listOfUniqueDataDivision = [...new Set(MAP(data, (d) => d.region))];

  // Listed out all the possible Region
  const listOfUniqueDivision = [
    ...new Set(MAP(statesDivision, (d) => d.Division)),
  ];

  // Create a search table to search for region through US State name
  const searchDivisionByStates = new Map();
  statesDivision.forEach((element) => {
    searchDivisionByStates.set(element.State, element.Division);
  });

  // Color scale for region
  const colorScale =
    scaleOrdinal(schemeCategory10).domain(listOfUniqueDivision);

  // Create binned data
  const binnedData = {};

  // Create all objects for binnedData
  listOfUniqueDataDivision.forEach((division) => {
    binnedData[division] = [{ average: 0 }];
  });

  // Categorize all region into the binnedData and calculate the average medical spending
  let temp;
  data.forEach((d) => {
    switch (d.region) {
      case "East South Central":
        // temp is just a pointer
        temp = binnedData["East South Central"];
        temp.push(d);

        // Get the previous average, multiple it by the total number of data in the array (find the sum)
        // Then add the medical spending of the newly added data into the sum
        // Divide it by the new length
        temp[0].average =
          (temp[0].average * (temp.length - 1) + d.charges) / temp.length;
        break;
      case "West South Central":
        temp = binnedData["West South Central"];
        temp.push(d);

        // Get the previous average, multiple it by the total number of data in the array (find the sum)
        // Then add the medical spending of the newly added data into the sum
        // Divide it by the new length
        temp[0].average =
          (temp[0].average * (temp.length - 1) + d.charges) / temp.length;
        break;
      case "East North Central":
        temp = binnedData["East North Central"];
        temp.push(d);

        // Get the previous average, multiple it by the total number of data in the array (find the sum)
        // Then add the medical spending of the newly added data into the sum
        // Divide it by the new length
        temp[0].average =
          (temp[0].average * (temp.length - 1) + d.charges) / temp.length;
        break;
      case "West North Central":
        temp = binnedData["West North Central"];
        temp.push(d);

        // Get the previous average, multiple it by the total number of data in the array (find the sum)
        // Then add the medical spending of the newly added data into the sum
        // Divide it by the new length
        temp[0].average =
          (temp[0].average * (temp.length - 1) + d.charges) / temp.length;
        break;
      default:
        break;
    }
  });

  // Loop through all Division and find the largest and smallest average value
  let max = 0;
  let min = 99999;
  listOfUniqueDataDivision.forEach((division) => {
    if (max < binnedData[division][0].average) {
      max = binnedData[division][0].average;
    }
    if (min > binnedData[division][0].average) {
      min = binnedData[division][0].average;
    }
  });

  // minus and plus 1000 to allow opacity
  const opacityScale = scalePow()
    .domain([min - 1000, max + 1000])
    .range([0, 1])
    .exponent(2);
  console.log(opacityScale.ticks());

  // Create a color legend with title and color
  const colorLegendData = listOfUniqueDataDivision.map((d) => ({
    title: d,
    opacity: opacityScale(binnedData[d][0].average),
  }));

  // Sort the data based on opacity level
  colorLegendData.sort((a, b) => b.opacity - a.opacity);

  colorLegendData.push({ title: "No Data", opacity: 1, color: noDataColor });

  const numberFormat = format(".3f");

  return (
    <svg className="App" width={width} height={height}>
      <g
        className="states"
        fill="none"
        stroke="#000"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {atlas.states.features.map((state, i) => {
          return (
            <path
              // Fill all the region that is not listed in the dataset
              fill={
                listOfUniqueDataDivision.includes(
                  searchDivisionByStates.get(state.properties.name)
                ) &&
                (!focus ||
                  focus[searchDivisionByStates.get(state.properties.name)])
                  ? availableDataColor
                  : noDataColor
              }
              opacity={
                listOfUniqueDataDivision.includes(
                  searchDivisionByStates.get(state.properties.name)
                ) &&
                (!focus ||
                  focus[searchDivisionByStates.get(state.properties.name)])
                  ? opacityScale(
                      binnedData[
                        searchDivisionByStates.get(state.properties.name)
                      ][0].average
                    )
                  : 1
              }
              key={i}
              className="test"
              strokeWidth={0.4}
              d={path(state)}
              // EX of the value of 'tooltip': 14965 (just show the data when hover)
              onMouseEnter={(event) => {
                setTooltip({
                  data: binnedData[
                    searchDivisionByStates.get(state.properties.name)
                  ]
                    ? binnedData[
                        searchDivisionByStates.get(state.properties.name)
                      ][0].average
                    : "No Data",
                  position: [event.clientX, event.clientY],
                });
              }}
              onMouseLeave={setTooltip.bind(null, null)}
            >
              <title>
                {binnedData[searchDivisionByStates.get(state.properties.name)]
                  ? binnedData[
                      searchDivisionByStates.get(state.properties.name)
                    ][0].average
                  : "No data"}
              </title>
            </path>
          );
        })}
      </g>
      <ColorLegend
        setFocus={setFocus}
        color={availableDataColor}
        height={height}
        width={width}
        colorLegendData={colorLegendData}
      />
      <NewColorLegend
        width={width}
        height={height}
        opacityScale={opacityScale}
        color={availableDataColor}
        noData={noDataColor}
      />
      {tooltip && (
        <Tooltip
          format={numberFormat}
          data={tooltip.data}
          clientX={tooltip.position[0]}
          clientY={tooltip.position[1]}
        />
      )}
    </svg>
  );
}

export default App;
