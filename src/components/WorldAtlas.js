import { useMemo } from "react";
// Color used for Division that have data
const availableDataColor = "#c92a2a";

const noDataColor = "#ced4da";

const WorldAtlas = ({
  searchDivisionByStates,
  atlas,
  focus,
  binnedData,
  listOfUniqueDataDivision,
  setTooltip,
  opacityScale
}) => {
  console.log("render Atlas")
  const path = geoPath();
  return (
    <g
      className="states"
      fill="none"
      stroke="#000"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {useMemo(
        atlas.states.features.map((state, i) => {
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
        }),
        []
      )}
    </g>
  );
};

export default WorldAtlas;
