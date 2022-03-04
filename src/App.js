import "./App.css";
import { useEffect, useState } from "react";
//import {FloorPlanEngine} from 'archilogic'
import ArchiSelect from "./components/ArchiSelect";

function App() {
  const [assets, setAssets] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  // Create publishable access token at https://developers.archilogic.com/access-tokens.html
  //   let queryString = window.location.search;
  //   let urlParams = new URLSearchParams(queryString);
  //   const publishableToken = urlParams.get("publishableToken");
  //   const demoSceneId = urlParams.get("demoSceneId");
  const publishableToken = "5d2e8502-9a07-4e10-a933-3234eebce84b";
  const demoSceneId = "e29f7047-19b0-41ae-8926-d6d9ad26a015";

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
      setCategory(Array.from(uniqualCategory));
    });
  }, []);

  useEffect(() => {
    if (selectedCategory.length && assets.length) {
      debugger;
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
      setSubCategory(Array.from(uniqualSubCategory));
    }
  }, [selectedCategory]);

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
    <div class="container">
      <div class="left">
        <h2>Space & Asset Recognizer</h2>
        <ArchiSelect
          list={category}
          title="category"
          value={selectedCategory}
          setter={setSelectedCategory}
        />
        <ArchiSelect list={subCategory} title="subcategory" />
      </div>
      <div id="hello-plan"></div>
    </div>
  );
}

export default App;
