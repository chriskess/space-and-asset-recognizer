import "./App.css";
import { useEffect, useState } from "react";
//import {FloorPlanEngine} from 'archilogic'
import ArchiSelect from "./components/ArchiSelect";

function App() {
  const [assets, setAssets] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  // Create publishable access token at https://developers.archilogic.com/access-tokens.html
  //   let queryString = window.location.search;
  //   let urlParams = new URLSearchParams(queryString);
  //   const publishableToken = urlParams.get("publishableToken");
  //   const demoSceneId = urlParams.get("demoSceneId");
  const publishableToken = "5d2e8502-9a07-4e10-a933-3234eebce84b";
  const demoSceneId = "e29f7047-19b0-41ae-8926-d6d9ad26a015";

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ];
  }

  useEffect(() => {
    const container = document.getElementById("hello-plan");
    const floorPlan = new window.FloorPlanEngine(container);
    floorPlan.loadScene(demoSceneId, { publishableToken }).then(() => {
      console.log(floorPlan.resources);
      setAssets(floorPlan.resources.assets);
      let uniqualCategory = new Set();
      floorPlan.resources.assets.forEach((asset) => {
        asset.categories.forEach((category) => uniqualCategory.add(category));
      });
      setCategory(
        Array.from(uniqualCategory).map((value) => ({
          value,
          color: "#aa0000",
        }))
      );
    });
  }, []);

  useEffect(() => {
    if (selectedCategory.length && assets.length) {
      //debugger;
      let uniqualSubCategory = new Set();
      assets.forEach((asset) => {
        if (
          asset.categories.some((category) =>
            selectedCategory.includes(category)
          )
        ) {
          asset.subCategories.forEach((subCategory) =>
            uniqualSubCategory.add(subCategory)
          );
        }
        console.log(uniqualSubCategory);
      });
      let listOfSubcategories = Array.from(uniqualSubCategory);
      setSubCategory(
        listOfSubcategories.map((value) => ({ value, color: "#ff0000" }))
      );
      setSelectedSubCategory(listOfSubcategories);
    }
  }, [selectedCategory]);

  useEffect(() => {
    assets.forEach((asset) => {
      //console.log(subCategory);
      let item = selectedSubCategory.find((item) =>
        asset.subCategories.includes(item)
      );

      if (item) {
        let { color } = subCategory.find((i) => i.value == item);
        //debugger;
        asset.node.setHighlight({ fill: hexToRgb(color) });
      } else {
        asset.node.setHighlight({ fill: [238, 241, 246, 255] });
      }
    });
  }, [selectedSubCategory, subCategory]);

  /*function generateSelectBox(list, title, assets, prop) {
    let select = document.createElement("select");
    select.multiple = true;
    select.onchange = function (e) {
      let { value } = e.target;
      assets.forEach((asset) => {
        if (asset[prop].includes(value) && value) {
          asset.node.setHighlight({ fill: [196, 0, 150] });
        } else if (!value) {
          console.log(value);
          asset.node.setHighlight({ fill: [238, 241, 246, 255] });
        }
      });
    };

    let option = document.createElement("option");
    option.innerText = "-- " + title + " --";
    option.value = "";
    select.appendChild(option);

    list.forEach((item) => {
      let option = document.createElement("option");
      option.innerText = item;
      option.value = item;
      select.appendChild(option);
    });
    document.querySelector(".left").appendChild(select);
  }*/
  return (
    <div className="container">
      <div className="left">
        <h2>Space & Asset Recognizer</h2>
        <ArchiSelect
          list={category}
          setList={setCategory}
          title="category"
          value={selectedCategory}
          setter={setSelectedCategory}
        />
        <ArchiSelect
          list={subCategory}
          setList={setSubCategory}
          title="subcategory"
          value={selectedSubCategory}
          setter={setSelectedSubCategory}
        />
      </div>
      <div id="hello-plan"></div>
    </div>
  );
}

export default App;
