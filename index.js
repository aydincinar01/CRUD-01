const mysql = require("mysql");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { json } = require("body-parser");

app.use(bodyParser.json());

let mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'testUser',
    password: '123456',
    database: 'employeeDB',
    multipleStatements: true
});

mysqlConnection.connect ((err) => {
    if(!err)
        console.log("DB connection is successful");
    else
        console.log("DB connection is FAIL ! \n Error : " + JSON.stringify(err, undefined, 2));
});

app.listen(3500, () => {
    console.log("Express server is running...");
});

app.get('/employees', (req, res) => {
    console.log("into get all employees route...");
    mysqlConnection.query('SELECT * FROM employee', (err, rows, fields) => {
        if(!err)
            res.send( (rows)); 
        else
            console.log('Something is wrong : ' + err);

    });
});


app.get('/employees/:id', (req, res) => {
    console.log("into get an employee route...");
    mysqlConnection.query('SELECT * FROM employee WHERE EmpID = ?',[req.params.id], (err, rows, fields) => {
        if(!err)
            res.send( ("Sonuc : " + JSON.stringify(rows))); 
        else
            console.log('Something is wrong : ' + err);

    });
});

app.delete('/employees/:id', (req, res) => {
    console.log("into delete route...");
    mysqlConnection.query('DELETE FROM employee WHERE EmpID = ?',[req.params.id], (err, rows, fields) => {
        if(!err)
            res.send("Delete Successful"); 
        else
            console.log("Can't delete the record. Error :" + err);
    });
});

//Insert an employees
app.post('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?; \
                SET @EmpCode = ?;SET @Salary = ?; \
                CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted employee id : '+element[0].EmpID);
            });
        else
            console.log(err);
    })
});

//Update an employees
app.put('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});