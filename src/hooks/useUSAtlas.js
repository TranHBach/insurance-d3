import { useState, useEffect } from "react";
import { json } from "d3";
import { feature, mesh } from "topojson";

const jsonUrl =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json";

export const useUSAtlas = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const row = (d) => {
      return d;
    };
    json(jsonUrl, row).then((topojsonData) => {
      setData({
        states: feature(
          topojsonData,
          topojsonData.objects.states,
        ),
        nations: feature(topojsonData, topojsonData.objects.nation),
      });
    });
  }, []);
  return data;
};
