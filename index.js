const express = require('express');
const bodyParser = require('body-parser');

const app = express();

let items = ["Buy Food", "Go to the gym", "Cook Food"];
let workItems = [];


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  let today = new Date();

  let options =  {
    weekday: "long",
    day: "numeric",
    month: "long"
  }
  let day = today.toLocaleDateString("en-Us",options)
   res.render("list", {kindOfDay: day, newListItems: items})
});

app.post('/', (req,res)=>{
  
  let item = req.body.newItem
  items.push(item);
  
  res.redirect("/")
})

.app.get('/', (req, res) => {
  res.render('list', {listTitle:"Work List", newListItems: workItems});

})
app.post("/work", function(req, res){
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})

app.listen(3000, () => {
  console.log('server started');
});
