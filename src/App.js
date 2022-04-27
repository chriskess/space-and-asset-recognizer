import "./App.css";
import Input from "@material-ui/core/Input";
import { useEffect, useState } from "react";
//import {FloorPlanEngine} from 'archilogic'
import ArchiSelect from "./components/ArchiSelect";

function App() {
  const [assets, setAssets] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [subCategory, setSubCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState({});

  const [spaceList, setSpaceList] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [selectedSpaces, setSelectedSpaces] = useState({});
  const [usage, setUsage] = useState([]);
  const [selectedUsage, setSelectedUsage] = useState({});

  // Create publishable access token at https://developers.archilogic.com/access-tokens.html
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  const publishableToken = urlParams.get("publishableToken");
  const demoSceneId = urlParams.get("demoSceneId");

  const [token, setToken] = useState(publishableToken);
  const [scene, setScene] = useState(demoSceneId);

  //const publishableToken = "5d2e8502-9a07-4e10-a933-3234eebce84b";
  //const demoSceneId = "e29f7047-19b0-41ae-8926-d6d9ad26a015";

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ];
  }

  useEffect(() => {
    if (token && scene) {
      const container = document.getElementById("hello-plan");
      const floorPlan = new window.FloorPlanEngine(container);
      floorPlan.loadScene(scene, { publishableToken: token }).then(() => {
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

        let uniqualSubCategory = new Set();
        floorPlan.resources.assets.forEach((asset) => {
          asset.subCategories.forEach((subcategory) =>
            uniqualSubCategory.add(subcategory)
          );
        });
        //debugger;
        setSubCategory(
          Array.from(uniqualSubCategory).map((value) => ({
            value,
            color: "#aa0000",
          }))
        );

        setSpaceList(floorPlan.resources.spaces);

        let uniqualSpaces = new Set();
        floorPlan.resources.spaces.forEach((space) => {
          uniqualSpaces.add(space.program);
        });
        setSpaces(
          Array.from(uniqualSpaces).map((value) => ({
            value,
            color: "#aa0000",
          }))
        );

        let uniqualUsages = new Set();
        floorPlan.resources.spaces.forEach((space) => {
          uniqualUsages.add(space.usageName);
        });
        //debugger;
        setUsage(
          Array.from(uniqualUsages).map((value) => ({
            value,
            color: "#aa0000",
          }))
        );
        // debugger;
      });
    }
  }, [token, scene]);

  useEffect(() => {
    for (let key in selectedSubCategory) {
      delete selectedSubCategory[key];
    }
    if (assets.length && Object.values(selectedCategory).some(Boolean)) {
      //debugger;
      let uniqualSubCategory = new Set();

      assets.forEach((asset) => {
        if (asset.categories.some((category) => selectedCategory[category])) {
          asset.subCategories.forEach((subCategory) =>
            uniqualSubCategory.add(subCategory)
          );
        }
        //console.log(uniqualSubCategory);
      });
      let listOfSubcategories = Array.from(uniqualSubCategory);
      //debugger;
      /*setSubCategory(
        listOfSubcategories.map((value) => ({ value, color: "#aa0000" }))
      );*/

      listOfSubcategories.forEach((item) => {
        selectedSubCategory[item] = true;
      });
    }
    setSelectedSubCategory({ ...selectedSubCategory });
  }, [selectedCategory]);

  useEffect(() => {
    for (let key in selectedUsage) {
      delete selectedUsage[key];
    }
    if (spaceList.length && Object.values(selectedSpaces).some(Boolean)) {
      //debugger;
      let uniqualUsage = new Set();

      spaceList.forEach((space) => {
        if (selectedSpaces[space.program]) {
          uniqualUsage.add(space.usageName);
        }
        //console.log(uniqualSubCategory);
      });
      let listOfUsage = Array.from(uniqualUsage);
      //debugger;
      //setUsage(listOfUsage.map((value) => ({ value, color: "#aa0000" })));

      listOfUsage.forEach((item) => {
        selectedUsage[item] = true;
      });
    }
    setSelectedUsage({ ...selectedUsage });
  }, [selectedSpaces]);

  useEffect(() => {
    //to update colors of subcategories if categories color was updated
    if (category.length && Object.values(selectedCategory).some(Boolean)) {
      let newSubCategories = [...subCategory].map((subcategory) => {
        let find = assets.find((item) =>
          item.subCategories.includes(subcategory.value)
        );
        let categoryFounded = find.categories.find(
          (category) => selectedCategory[category]
        );
        let color = category.find((item) => item.value === categoryFounded);
        if (color) {
          subcategory.color = color.color;
        }
        //debugger;
        return subcategory;
      });

      //debugger;
      setSubCategory(newSubCategories);
    }
  }, [category]);

  useEffect(() => {
    if (spaces.length && Object.values(selectedSpaces).some(Boolean)) {
      console.log({ spaceList, spaces, selectedSpaces, usage, selectedUsage });
      //debugger;
      let newUsage = usage.map((usageItem) => {
        let program = spaceList.find((i) => i.usageName === usageItem.value)
          .program;
        let color = spaces.find((i) => i.value === program).color;
        return { ...usageItem, color };
      });
      /*let uniqualUsage = new Set();

      spaceList.forEach((space) => {
        if (selectedSpaces.includes(space.program)) {
          uniqualUsage.add(space.usageName);
        }
        //console.log(uniqualSubCategory);
      });
      let listOfUsage = Array.from(uniqualUsage);
      setUsage(listOfUsage.map((value) => ({ value, color: "#aa0000" })));
      setSelectedUsage(listOfUsage);
      */
      //debugger;
      setUsage(newUsage);
    }
  }, [spaces]);

  useEffect(() => {
    assets.forEach((asset) => {
      //console.log(subCategory);
      let item = asset.subCategories.find((item) => selectedSubCategory[item]);
      if (item) {
        //debugger;
        let { color } = subCategory.find((i) => i.value == item);
        //debugger;
        asset.node.setHighlight({ fill: hexToRgb(color) });
      } else {
        asset.node.setHighlight({ fill: [238, 241, 246, 255] });
      }
    });
  }, [selectedSubCategory, subCategory]);

  useEffect(() => {
    spaceList.forEach((space) => {
      // debugger;
      if (selectedUsage[space.usageName]) {
        let { color } = usage.find((i) => i.value == space.usageName);
        //debugger;
        space.node.setHighlight({ fill: hexToRgb(color) });
      } else {
        space.node.setHighlight({ fill: [255, 255, 255] });
      }
    });
  }, [selectedUsage, usage]);

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
        <Input
          value={token}
          placeholder="YOUR TOKEN"
          onChange={(e) => setToken(e.target.value)}
          style={{ width: "330px" }}
        />
        <Input
          value={scene}
          placeholder="YOUR SCENE ID"
          onChange={(e) => setScene(e.target.value)}
          style={{ width: "330px" }}
        />
        <h2>Asset Recognizer</h2>
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
        <h2>Space Recognizer</h2>
        <ArchiSelect
          list={spaces}
          setList={setSpaces}
          title="space"
          value={selectedSpaces}
          setter={setSelectedSpaces}
        />
        <ArchiSelect
          list={usage}
          setList={setUsage}
          title="usage"
          value={selectedUsage}
          setter={setSelectedUsage}
        />
      </div>
      <div id="hello-plan"></div>
    </div>
  );

  /*
    <div className="info">
      Please add your sceneID and token into your browser in the following
      format
      <div>
        <code>
          <i>YOUR DOMAIN</i>
          <b>/?publishableToken=</b>
          <i>YOUR TOKEN</i>
          <b>&demoSceneId=</b>
          <i>YOUR SCENE ID</i>
        </code>
      </div>
    </div>
  */
}

export default App;
