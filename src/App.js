import "./App.css";
import {
  scaleOrdinal,
  schemeDark2,
  bin,
  extent,
  format,
  map as MAP,
  max as MAX,
  scalePow,
} from "d3";
import { useUSAtlas } from "./hooks/useUSAtlas";
import { useStatesDivision } from "./hooks/useStatesDivision";
import { useData } from "./hooks/useData";
import ColorLegend from "./components/ColorLegend";
import { useMemo, useState } from "react";
import NewColorLegend from "./components/NewColorLegend";
import Tooltip from "./components/ToolTip";
import WorldAtlas from "./components/WorldAtlas";
import AgeLineChart from "./components/AgeLineChart";

const height = 1200;
const width = 1200;

// Color used for Division that have data
const availableDataColor = "#c92a2a";

const noDataColor = "#ced4da";

// Create a function to create binned data and then develop a simplier dataset
const createBinnedAgeData = (data) => {
  const spendingAccessor = (d) => d.age;
  const ageAccessor = (d) => d.age;

  // Create the threshold for aged data
  const thresholdList = [];
  let binnedAgeData = null;
  if (data) {
    for (let i = 0; i < MAX(data, ageAccessor); i += 1) {
      thresholdList.push(i);
    }

    // Calculate binned data based on age
    binnedAgeData = bin()
      .value(ageAccessor)
      .domain(extent(data, spendingAccessor))
      .thresholds(thresholdList)(data);
  }
  return binnedAgeData;
};

const createSimpleData = (data) => {
  return (
    data &&
    data.map((ageList) => {
      // Get the age of the respondents inside of ageList
      // Since everyone has the same age
      // We can just get the age of the first respondent
      let overallAge = ageList[0].age;

      // Sum of spending for a specific age
      let sum = 0;
      let counter = 0;
      ageList.forEach((age) => {
        sum += age.charges;
        counter += 1;
      });

      // Average of spending for a specific age
      let average = sum / counter;

      return { age: overallAge, average: average };
    })
  );
};

function App() {
  // Create hover effect
  const [focus, setFocus] = useState();
  const [focusType, setFocusType] = useState();

  // Filter criteria for data
  const [filtered, setFiltered] = useState();

  // data of the tooltip
  const [tooltip, setTooltip] = useState();
  const unfilteredData = useData();

  // Filtering data if filtered State is not null
  let data;
  if (filtered && unfilteredData) {
    data = unfilteredData.filter(
      (d) => filtered.start <= d.age && d.age <= filtered.end
    );
    if (!data) {
      data = unfilteredData;
    }
  } else {
    data = unfilteredData;
  }

  // Create different category
  const smoker =
    unfilteredData && unfilteredData.filter((d) => d.smoker === "yes");
  const nonSmoker =
    unfilteredData && unfilteredData.filter((d) => d.smoker === "no");
  const male = unfilteredData && unfilteredData.filter((d) => d.sex === "male");
  const female =
    unfilteredData && unfilteredData.filter((d) => d.sex === "female");

  const typeScale = scaleOrdinal(schemeDark2).domain([
    "All",
    "Smoker",
    "Non-Smoker",
    "Male",
    "Female",
  ]);

  const colorLegendTypeData = typeScale
    .domain()
    .map((d) => ({ title: d, color: typeScale(d) }));

  console.log(colorLegendTypeData);

  const atlas = useUSAtlas();

  // States filtered by its Division (East, West, NorthEast, etc...)
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

  // Create binned data for region in term of average spending
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

  // Basic binned data for everyone
  const binnedAgeData = useMemo(
    () => createBinnedAgeData(unfilteredData),
    [unfilteredData]
  );

  let simpleAgeData = useMemo(
    () => createSimpleData(binnedAgeData),
    [binnedAgeData]
  );

  // Filter Smoker only
  const binnedSmokerData = useMemo(() => createBinnedAgeData(smoker), [smoker]);

  let simpleSmokerData = useMemo(
    () => createSimpleData(binnedSmokerData),
    [binnedSmokerData]
  );

  // Filter non-smoker only
  const binnedNonSmokerData = useMemo(
    () => createBinnedAgeData(nonSmoker),
    [nonSmoker]
  );

  let simpleNonSmokerData = useMemo(
    () => createSimpleData(binnedNonSmokerData),
    [binnedNonSmokerData]
  );

  // Filter male only
  const binnedMaleData = useMemo(() => createBinnedAgeData(male), [male]);

  let simpleMaleData = useMemo(
    () => createSimpleData(binnedMaleData),
    [binnedMaleData]
  );

  // Filter female only
  const binnedFemaleData = useMemo(() => createBinnedAgeData(female), [female]);

  let simpleFemaleData = useMemo(
    () => createSimpleData(binnedFemaleData),
    [binnedFemaleData]
  );

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

  if (!atlas || !statesDivision || !unfilteredData) {
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
        padding={{ right: 200, top: 50 }}
        click={false}
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
      <AgeLineChart
        setFiltered={setFiltered}
        height={height}
        color={colorLegendTypeData}
        data={simpleAgeData}
        smoker={simpleSmokerData}
        nonSmoker={simpleNonSmokerData}
        male={simpleMaleData}
        female={simpleFemaleData}
        focus={focusType}
      />
      <ColorLegend
        setFocus={setFocusType}
        color={availableDataColor}
        height={height}
        width={width}
        colorLegendData={colorLegendTypeData}
        padding={{ right: 200, top: 700 }}
        focus={focusType}
        click={true}
      />
    </svg>
  );
}

export default App;
