import { useMemo } from "react";
import { geoPath } from "d3";
// Color used for Division that have data
const availableDataColor = "#c92a2a";

const noDataColor = "#ced4da";
const path = geoPath();

const WorldAtlas = ({
  searchDivisionByStates,
  atlas,
  focus,
  binnedAverageData,
  listOfUniqueDataDivision,
  setTooltip,
  opacityScale,
}) => {
  // Use memo tested
  return (
    <g
      className="states"
      fill="none"
      stroke="#000"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {useMemo(
        () =>
          atlas.states.features.map((state, i) => {
            console.log("render atlas")
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
                        binnedAverageData[
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
                onMouseMove={(event) => {
                  setTooltip({
                    data: binnedAverageData[
                      searchDivisionByStates.get(state.properties.name)
                    ]
                      ? binnedAverageData[
                          searchDivisionByStates.get(state.properties.name)
                        ][0].average
                      : "No Data",
                    position: [event.clientX, event.clientY],
                  });
                }}
                onMouseLeave={setTooltip.bind(null, null)}
              >
              </path>
            );
          }),
        [
          atlas.states.features,
          binnedAverageData,
          focus,
          listOfUniqueDataDivision,
          opacityScale,
          searchDivisionByStates,
          setTooltip,
        ]
      )}
    </g>
  );
};

export default WorldAtlas;
