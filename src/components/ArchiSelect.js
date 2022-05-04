import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
    maxWidth: 350,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function ArchiSelect({
  list,
  setList,
  title,
  value = {},
  setter = () => {},
  uncheckedItemsHandler = () => {},
}) {
  const [items, setItems] = useState(value);
  const classes = useStyles();

  const handleChange = (event) => {
    //debugger;
    let newValue = event.target.value.reduce((obj, item) => {
      obj[item] = true;
      return obj;
    }, {});

    let findKeysUnchecked = [];
    for (let key in items) {
      if (!newValue[key]) {
        findKeysUnchecked.push(key);
      }
    }
    uncheckedItemsHandler(findKeysUnchecked);
    setItems(newValue);
    setter(newValue);
  };

  const handleColor = (event, index) => {
    event.stopPropagation();
    let newList = [...list];
    newList[index].color = event.target.value;
    console.log(newList);
    setList(newList);
  };

  useEffect(() => {
    setItems(value);
  }, [value]);

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="demo-mutiple-checkbox-label">{title}</InputLabel>
      <Select
        labelId="demo-mutiple-checkbox-label"
        id="demo-mutiple-checkbox"
        multiple
        value={Object.entries(items).reduce((arr, [item, value]) => {
          if (value) {
            arr.push(item);
            return arr;
          }
        }, [])}
        onChange={handleChange}
        input={<Input />}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
      >
        {list.map((item, index) => (
          <MenuItem key={item.value} value={item.value}>
            <Checkbox
              sx={{
                color: item.color,
                "&.Mui-checked": {
                  color: item.color,
                },
              }}
              checked={items[item.value]}
            />
            <ListItemText primary={item.value} />
            <input
              type="color"
              value={item.color}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handleColor(e, index)}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
