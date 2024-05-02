const express = require("express")
const { connection } = require("./config/db")
const cors = require("cors");
const { userRouter } = require("./routes/userRouter");
const { postRoute } = require("./routes/postRouter");
const path = require("path");
const { auth } = require("./middlewares/auth.middleware");


const app = express()
app.use(express.json())
app.use(cors());
app.use("/", userRouter)

// Protected routes
app.use("/",auth, postRoute);

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(process.env.port, async() => {
	try {
		await connection
		console.log("connected to the DB")
		console.log(`Server is running at port ${process.env.port}`)
	} catch (err) {
		console.log(err)
	}
})