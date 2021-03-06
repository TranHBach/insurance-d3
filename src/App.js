import "./App.css";
import { bin, format, map as MAP, max as MAX, scalePow } from "d3";
import { geoPath, scaleOrdinal, schemeCategory10, interpolateReds } from "d3";
import { useUSAtlas } from "./hooks/useUSAtlas";
import { useStatesDivision } from "./hooks/useStatesDivision";
import { useData } from "./hooks/useData";
import ColorLegend from "./components/ColorLegend";
import { useMemo, useState } from "react";
import NewColorLegend from "./components/NewColorLegend";
import Tooltip from "./components/ToolTip";
import WorldAtlas from "./components/WorldAtlas";

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

  // if (!atlas || !statesDivision || !data) {
  //   return <p>Loading...</p>;
  // }

  // List out all the region in the dataset
  const listOfUniqueDataDivision = useMemo(
    () => data && [...new Set(MAP(data, (d) => d.region))],
    [data]
  );

  // Listed out all the possible Region (not needed at the moment)
  // const listOfUniqueDivision = [
  //   ...new Set(MAP(statesDivision, (d) => d.Division)),
  // ];

  // Create a search table to search for region through US State name
  const searchDivisionByStates = useMemo(() => {
    const searchDivisionByStates = new Map();
    statesDivision &&
      statesDivision.forEach((element) => {
        searchDivisionByStates.set(element.State, element.Division);
      });
    return searchDivisionByStates;
  }, [statesDivision]);

  // Color scale for region (not needed at the moment)
  // const colorScale =
  //   scaleOrdinal(schemeCategory10).domain(listOfUniqueDivision);

  // Create binned data
  const binnedAverageData = useMemo(() => {
    const binnedAverageData = {};

    // Create all objects for binnedAverageData
    listOfUniqueDataDivision &&
      listOfUniqueDataDivision.forEach((division) => {
        binnedAverageData[division] = [{ average: 0 }];
      });

    // Categorize all region into the binnedAverageData and calculate the average medical spending
    let temp;
    data &&
      data.forEach((d) => {
        switch (d.region) {
          case "East South Central":
            // temp is just a pointer
            temp = binnedAverageData["East South Central"];
            temp.push(d);

            // Get the previous average, multiple it by the total number of data in the array (find the sum)
            // Then add the medical spending of the newly added data into the sum
            // Divide it by the new length
            temp[0].average =
              (temp[0].average * (temp.length - 1) + d.charges) / temp.length;
            break;
          case "West South Central":
            temp = binnedAverageData["West South Central"];
            temp.push(d);

            // Get the previous average, multiple it by the total number of data in the array (find the sum)
            // Then add the medical spending of the newly added data into the sum
            // Divide it by the new length
            temp[0].average =
              (temp[0].average * (temp.length - 1) + d.charges) / temp.length;
            break;
          case "East North Central":
            temp = binnedAverageData["East North Central"];
            temp.push(d);

            // Get the previous average, multiple it by the total number of data in the array (find the sum)
            // Then add the medical spending of the newly added data into the sum
            // Divide it by the new length
            temp[0].average =
              (temp[0].average * (temp.length - 1) + d.charges) / temp.length;
            break;
          case "West North Central":
            temp = binnedAverageData["West North Central"];
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
    return binnedAverageData;
  }, [data, listOfUniqueDataDivision]);

  let max = 0;
  let min = 99999;

  // Loop through all Division and find the largest and smallest average value
  listOfUniqueDataDivision &&
    listOfUniqueDataDivision.forEach((division) => {
      if (max < binnedAverageData[division][0].average) {
        max = binnedAverageData[division][0].average;
      }
      if (min > binnedAverageData[division][0].average) {
        min = binnedAverageData[division][0].average;
      }
    });

  // minus and plus 1000 to allow opacity
  const opacityScale = useMemo(() => {
    return scalePow()
      .domain([min - 1000, max + 1000])
      .range([0, 1])
      .exponent(2);
  }, [max, min]);

  // Create a color legend with title and color
  const colorLegendData = useMemo(() => {
    if (listOfUniqueDataDivision) {
      const colorLegendData = listOfUniqueDataDivision.map((d) => ({
        title: d,
        opacity: opacityScale(binnedAverageData[d][0].average),
      }));

      // Sort the data based on opacity level
      colorLegendData.sort((a, b) => b.opacity - a.opacity);

      colorLegendData.push({
        title: "No Data",
        opacity: 1,
        color: noDataColor,
      });
      return colorLegendData;
    }
    return null;
  }, [binnedAverageData, listOfUniqueDataDivision, opacityScale]);

  if (!atlas || !statesDivision || !data) {
    return <p>Loading...</p>;
  }
  const numberFormat = format(".3f");

  return (
    <svg className="App" width={width} height={height}>
      <WorldAtlas
        searchDivisionByStates={searchDivisionByStates}
        atlas={atlas}
        focus={focus}
        binnedAverageData={binnedAverageData}
        listOfUniqueDataDivision={listOfUniqueDataDivision}
        setTooltip={setTooltip}
        opacityScale={opacityScale}
      />
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
