import { useState, useEffect } from "react";
import { csv } from "d3";

const csvUrl =
  "https://gist.githubusercontent.com/TranHBach/b9ad5f0258693f375278ffda1017f359/raw/bd51d8697fc0ed1c1c424a45d0e1222a82eac505/insurance.csv";

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const row = (d) => {
      d.age = +d.age;
      d.children = +d.children;
      d.charges = +d.charges;
      switch (d.region) {
        case "southeast":
          d.region = "East South Central";
          break;
        case "southwest":
          d.region = "West South Central";
          break;
        case "northeast":
          d.region = "East North Central";
          break;
        case "northwest":
          d.region = "West North Central";
          break;
        default:
          break;
      }
      return d;
    };
    csv(csvUrl, row).then(setData);
  }, []);
  return data;
};
