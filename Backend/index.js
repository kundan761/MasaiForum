const express = require("express")
const { connection } = require("./config/db")
const cors = require("cors");
// const { userRouter } = require("./routes/user.routes")

const app = express()
app.use(express.json())
app.use(cors());
// app.use("/users", userRouter)

//Use auth middleware for restricted routes

app.listen(process.env.port, async() => {
	try {
		await connection
		console.log("connected to the DB")
		console.log(`Server is running at port ${process.env.port}`)
	} catch (err) {
		console.log(err)
	}
})