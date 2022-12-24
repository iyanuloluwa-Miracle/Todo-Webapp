//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
//use mongoose for connecting to the server
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//server for also connecting to the host
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});

//const items = ["Buy Food", "Cook Food", "Eat Food"];
//const workItems = [];

const itemsSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemsSchema);
//creating a new item in the document
const item1 = new Item({
  name: "Welcome to your todoList",
});
const item2 = new Item({
  name: "Hit the + button to add a new item",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

//creating a new schema

const listSchema = {
  name: String,
  items: [itemsSchema],
};
//creating this after the schema!
const List = mongoose.model("List", listSchema);

//check the documentation to understand how it works

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved ");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});
// for adding new items
app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  //creating new document
  const item = new Item({
    name: itemName,
  });
  //saving items
  if (listName === "Today") {
    item.save();
    //redirect to the home route
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

//deleting a list and the route

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Successfully deleted checked item");
        res.redirect("/");
      }
    });
  }else{
    List.findOneAndUpdate({name: listName},{$pull:{items: {_id:checkedItemId}}}, function(err,foundList){
      if(!err){
        res.redirect("/" + listName)

      }
    })
  }
});

//using unknown parameters to navigate
app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //create a new List
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        //show an existing list
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3009, function () {
  console.log("server started on port 3009");
});
