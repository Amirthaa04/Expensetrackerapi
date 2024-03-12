const mongoose = require('mongoose')
const express = require('express')
const {Expense}=require('./Schema.js')
const bodyparser=require('body-parser')
const cors=require('cors')

/*
 * Expense Tracker
 * 
 * Addind a new expens -> add-expense
 * post-request : expenses-information
 * 
 * display existing records -> get-expenses
 * get-request : expenses user entries
 * 
 * delete a  expense -> delete-expense
 * post-request : id of the entry
 * delete-request
 * 
 * update an existing one -> update-expense
 * post-request : id of the entry , expenses details
 * patch -request
 */


/*
 * Database Schema
amount, category,data
 */

const app = express()
app.use(bodyparser.json())
app.use(cors())
async function connecttoDB() {
    try {
        await mongoose.connect('mongodb+srv://Amirtha:amirtha@cluster0.yjyqtgf.mongodb.net/Expensetracker?retryWrites=true&w=majority&appName=Cluster0')
        console.log('DB connection established;')
        const port=process.env.PORT || 8000
        app.listen(8000, function () {
            console.log(`Listening on port ${port}...`)
        })
    }
    catch (error) {
        console.log(error)
        console.log("could'nt established connection")
    }
}

connecttoDB()

// app.post('/add-expense',function(request,response){
//     // console.log(request.body)
//     // response.send(request.body)
//     Expense.create({
//         "amount":request.body.amount,
//         "category":request.body.category,
//         "date":request.body.date

//     })

   
// })

app.post('/add-expense', async function(request, response) {
    try {
        await Expense.create({
            "amount" : request.body.amount,
            "category" : request.body.category,
            "date" : request.body.date
        })
        response.status(201).json({
            "status" : "success",
            "message" : "entry created"
        })
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "entry not created",
            "error" : error
        })
    }
})

app.get('/get-expense',async function(request,response){
    try{
        const expenseDetails= await Expense.find()
        response.status(200).json(expenseDetails)
    }
    catch(error){
        response.status(500).json({
            "status" : "failure",
            "message" : "could not fetch data",
            "error" : error
        }) 
    }

})

// app.delete('/delete-expense/:id',async function(request,response){
// //   console.log(request.params)
// const expenseEntry= await Expense.findById(request.params.id)
// if(expenseEntry){
//     await Expense.findByIdAndDelete(request,params.id)
//     response.status(200).json({
//         "status":"success",
//         "message":"entry deleted"
//     })
// }
// else{
//     response.status(404).json({
//         "status":"failure",
//         "message":"entry not found"
//     })
// }
// })

// localhost:8000/delete-expense/65efdf58a22a20e156658094

// localhost:8000/delete-expense/65efdf58a22a20e156658094
app.delete('/delete-expense/:id', async function(request, response) {
    try {
        const expenseEntry = await Expense.findById(request.params.id)
        if(expenseEntry) {
            await Expense.findByIdAndDelete(request.params.id)
            response.status(200).json({
                "status" : "success",
                "message" : "entry deleted"
            })
        } else {
            response.status(404).json({
                "status" : "failure",
                "message" : "entry not found"
            })
        }
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not delete entry",
            "error" : error
        })
    }
})

app.patch('/update-expense/:id', async function(request, response) {
    try {
        const expenseEntry = await Expense.findById(request.params.id)
        if(expenseEntry) {
            await expenseEntry.updateOne({
                "amount" : request.body.amount,
                "category" : request.body.category,
                "date" : request.body.date
            })
            response.status(200).json({
                "status" : "success",
                "message" : "entry updated"
            })
        } else {
            response.status(404).json({
                "status" : "failure",
                "message" : "entry not found"
            })
        }
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not update entry",
            "error" : error
        })
    }
})