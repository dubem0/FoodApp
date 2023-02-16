//const { food, employees, resturants} = require('./companyData');
const food = require('./dataBase/food');
const bodyParser = require('body-parser');
const  resturant = require('./dataBase/resturant');
const employee = require('./dataBase/employee');
const user = require('./dataBase/user');

const fs = require("fs")

const express = require('express');
const app = express()
const port = 3040;

app.use(bodyParser.json());

app.get("/", authenticate, (req,res) =>{
    res.send("this is the home page")
})
app.get("/food", (req,res) =>{
    res.send(food)
})

app.get("/employee", (req,res) =>{
    res.send(employee)
})

app.get("/resturant", (req,res) =>{
    res.send(resturant)
})

//
app.get("/user", (req,res) =>{
    res.send(user)
})
//

app.post("/food", (req,res)=> {
    const food = {
       id : req.body.id ,
       name :  req.body.name ,
       description :  req.body.description ,
       portion :  req.body.portion ,
       price :  req.body.price ,
    }

    //read the existing data from the file
    let data = fs.readFileSync('database/food.json');

    // parse the data as JSON
    let foods = JSON.parse(data);

    //add the new food object to the array
    foods.push(food)

    //add the new updated array back to the file
    fs.writeFileSync( 'dataBase/food.json', JSON.stringify(foods));

    res.send(food)
});

app.post("/employee", (req,res)=> {
    const employee = {
       id : req.body.id ,
       name :  req.body.name ,
       nationality :  req.body.nationality ,
       state :  req.body.state ,
       gender :  req.body.gender ,
       dateEmployed :  req.body.dateEmployed ,
       status :  req.body.status ,
    }


    //read the existing data from the file
    let data = fs.readFileSync('database/employee.json');

    // parse the data as JSON
    let employees = JSON.parse(data);

    //add the new employee object to the array
    employees.push(employee)

    //add the new updated array back to the file
    fs.writeFileSync( 'dataBase/employee.json', JSON.stringify(employees));

    res.send(employee)

});

app.post("/resturant", (req,res)=> {
    const resturant = {
       
         id: req.body.id,
         name : req.body.name,
         location : req.body.location,
         rating: req.body.rating,
         employees : req.body.employees,
    }


    //read the existing data from the file
    let data = fs.readFileSync('database/resturant.json');

    // parse the data as JSON
    let resturants = JSON.parse(data);

    //add the new employee object to the array
    resturants.push(resturants)

    //add the new updated array back to the file
    fs.writeFileSync( 'dataBase/resturant.json', JSON.stringify(resturants));
    res.send(resturant)

});

//
app.post("/user", (req,res)=> {
    const user = {
       id : req.body.id ,
       username :  req.body.username ,
       first_name :  req.body.first_name ,
       last_name :  req.body.last_name ,
       email :  req.body.email ,
       password : req.body.password,
    }

    //read the existing data from the file
    let data = fs.readFileSync('database/user.json');

    // parse the data as JSON
    let users = JSON.parse(data);

    //add the new food object to the array
    users.push(user)

    //add the new updated array back to the file
    fs.writeFileSync( 'dataBase/user.json', JSON.stringify(users));

    res.send(user)
})

app.post('/login', (req,res) => {
    //extract the username and password from the request body
    const {username, password} = req.body;

    const users = user.find(u  => u.username === username);

    if(!users) {
        return res.status(401).json({
            message: 'auth failed'
        });
    }

    if (password === users.password){
        const token = Buffer.from(`${username}:${password}`).toString('base64');

        return res.status(200).json({
            message: 'Auth seccessful',
            token : token
        });
    } else {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
});

//middleware to authenticate requests
function authenticate (req,res, next){
    if(req.headers.authorization){
        const authHeader = req.headers.authorization.split(' ');
        const authType = authHeader [0];
        const authValue = authType[1];

        if (authType === 'Basic'){
            const [username, password] =  Buffer.from(authValue, 'base64').toString().split(':');

            const users = user.find (u => u.username === username);

            if (!users) {
                return res.status(401).json({
                    message: "authentication failed"
                });
            }

            if (password === user.password) {
                req.user = user.username;
                next();

            } else {
                return res.status(401).json({
                    message: 'Username or password is incorrect'
                })
            }
            } else{
                return res.status(401).json({
                message: 'Unathorized'
            });
        }
    } else {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
}
//



app.patch("/food/:id", (req,res) => {
     //const id = req.params.id *; 
    const foods= JSON.parse(fs.readFileSync('database/food.json'))

     //find the matching employee
     const food = foods.find(food => food.id ==req.params.id);

     //update the food properties

     food.id = req.body.id,
     food.name = req.body.name,
     food.description = req.body.description,
     food.portion = req.body.portion,
     food.price = req.body.price;



     fs.writeFileSync( 'dataBase/food.json', JSON.stringify(foods));

     res.send(food);

});

app.patch("/employee/:id", (req,res) => {
    //const id = req.params.id *; 
   const employees= JSON.parse(fs.readFileSync('database/employee.json'))

    //find the matching employee
    const employee = employees.find(e => e.id ==req.params.id);

    //update the food properties

    food.id = req.body.id,
    food.name = req.body.name,
    food.description = req.body.description,
    food.portion = req.body.portion,
    food.price = req.body.price;



    fs.writeFileSync( 'dataBase/employee.json', JSON.stringify(employees));

    res.send(employee);

});

// get employee by id
app.get("/employee/:id", (req, res) => {
    //read the existing data from the file
    let data = fs.readFileSync('database/employee.json');

    //parse the data as JSON
    let employees = JSON.parse(data);

    //find the employee with the spdecified is
    let employee = employees.find(employee => employee.id == req.params.id);

    //send the found employee back as the response
    if(employee){
        res.send(employee);
    } else{
        res.status(404).send({error: "Employee does not exist"});
    }
});

//delete a food data
 app.delete('/food/:id' , (req,res) => {
    const id = req.params.id;
    //read the JSON file
    const foods = JSON.parse(fs.readFileSync('database/food.json'));

    //remove the matching food
    const filteredfood = foods.filter(food => food.id !=id);

    const filteredfoodData = JSON.stringify(filteredfood);

    fs.writeFileSync('database/food.json', filteredfoodData);
    res.send("Oops, food has been deleted");
 });
 

app.use((req,res) => {
    res.status(404).json({message: 'Page Not Found'});
});

 app.listen(port, () => { 
    console.log(`Server running at http://localhost:${port}`); });
