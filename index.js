const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");
console.log(date)



const app = express();

const items = ["Buy Food", "Go to the gym", "Cook Food"];
const workItems = [];


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  let day = date.getDate();

   res.render("list", {listTitle: day, newListItems: items})
  });
    
  

app.post('/', (req,res)=>{
  let item = req.body.newItem
  
  if(req.body.list === 'Work'){
    workItems.push(item)
    res.redirect("/work")
    
  }else{
     items.push(item);
     res.redirect("/")
    
  }
  
  //res.redirect("/")
})

app.get('/work', (req, res) => {
  res.render('list', {listTitle:"Work List", newListItems: workItems});

})

app.listen(3000, () => {
  console.log('server started');
});
