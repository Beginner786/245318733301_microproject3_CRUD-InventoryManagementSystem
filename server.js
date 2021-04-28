const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/Inventory1',(err,database)=>{
	if(err) return console.log(err)
	db=database.db('Inventory1')
	app.listen(5000, ()=>{
		console.log('listening at port 5000')
	})
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//Home page
app.get('/',(req,res)=>{
	db.collection('GameShop').find().toArray((err,result)=>{
		if(err) return console.log(err)
		res.render('homepage.ejs', {data:result})
	})
})

app.get('/addproduct', (req,res)=>{
	res.render('add.ejs')
})

app.get('/updatestock', (req,res)=>{
	res.render('update.ejs')
})

app.get('/deleteproduct', (req,res)=>{
	res.render('delete.ejs')
})

app.get('/updatesales', (req,res)=>{
	res.render('updates.ejs')
})

app.post('/AddData', (req,res)=>{
	db.collection('GameShop').save(req.body, (err,result)=>{
		if(err) return console.log(err)
	res.redirect('/')
	})
})

app.post('/update', (req,res)=>{
	db.collection('GameShop').find().toArray((err,result)=>{
		if(err) return console.log(err)
	for(var i=0;i<result.length;i++)
	{
		if(result[i].pid==req.body.pid)
		{
			s = result[i].stock
			break
		}
	}
	db.collection('GameShop').findOneAndUpdate({pid: req.body.pid}, {
	$set: {stock:(parseInt(s) + parseInt(req.body.stock)).toString()}}, {sort: {_id:-1}},
	(err,result)=>{
		if(err) return console.log(err)
	console.log(req.body.id+' stock updated')
	res.redirect('/')
	})
	})
})


app.post('/update2', (req,res)=>{
	db.collection('Sales').findOneAndUpdate({Saleid: req.body.Saleid}, {
	$set: {PurchaseTT:(req.body.PurchaseTT).toString(),Productid: (req.body.Productid), Quantity : (req.body.Quantity), Total: (req.body.Total)}}, {sort: {_id:-1}},
	(err,result)=>{
		if(err) return console.log(err)
	console.log(' sale updated')
	res.redirect('/')
	})
})


app.post('/delete', (req,res)=>{
	db.collection('GameShop').findOneAndDelete({pid:req.body.pid},(err,result)=>{
		if(err) return console.log(err)
	res.redirect('/')
	})
})

app.get('/salesdetails',(req,res)=>{
	db.collection('Sales').find().toArray((err,result)=>{
		if(err) return console.log(err)
		res.render('showsales.ejs', {data2:result})
	})
})