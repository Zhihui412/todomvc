const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

const sqlCon = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "root",
    database: "todoapp"
})

app.post("/insert", (req, res) => {
    let content = req.body.content
    let completed = req.body.completed

    sqlCon.query(`INSERT INTO todotable ( content, completed) values('${content}','${completed}')`, 
        (error, result) => {
            if (error) {
                console.log(error);
            }
            if (result) {
                res.send('添加成功！')
            }
        })
})

app.get("/retrieve", (req, res) => {
    sqlCon.query("SELECT * FROM todotable", (error, result) => {
        if (error) {
            console.log(error);
        }
        if (result) {
            console.log(result);
            res.send(result)
        }
    })
})

app.post("/edit", (req, res) => {
    let id = req.body.id
    let content = req.body.content
    let completed = req.body.completed 

    sqlCon.query(
    `UPDATE todotable set content = '${content}' , completed = ${completed} where id = ${id}`,
    (error, result ) => {
        if (error) {
            console.log(error);
        }
        if (result) {
            res.send("修改成功！")
        }
    })
})
app.post("/update", (req, res) => {
    let id = req.body.id
    let completed = req.body.completed

    sqlCon.query(
    `UPDATE todotable set  completed = !${completed} where id = ${id}`,
    (error, result ) => {
        if (error) {
            console.log(error);
        }
        if (result) {
            res.send("修改成功！")
        }
    })
})
app.post("/delete", (req, res) => {
    let id = req.body.id
    sqlCon.query(`DELETE FROM todotable where id = ${id}` ,
    (error, result) => {
        if (error) {
            console.log(error);
        }
        if (result) {
            res.send("删除成功！")
            console.log(result);
        }
    })
})

app.post("/deleteCompleted", (req, res) => {
    sqlCon.query(`DELETE FROM todotable where completed = 1` ,
    (error, result) => {
        if (error) {
            console.log(error);
        }
        if (result) {
            res.send("删除成功！")
            console.log(result);
        }
    })
})


app.listen(5000, () => {
    console.log('Server running on port 5000...');
})