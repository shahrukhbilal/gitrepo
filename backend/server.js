require('dotenv').config()
const  express = require('express')
const app = express()
const cors = require('cors')
const PORT = 5000
const connectDB= require('./config/dbConnection')
const heroSliderRoutes = require('./routes/heroSliderRoutes')
const categoryRoutes = require('./routes/categoryRoutes');
const featuredCategoryRoutes = require('./routes/featuredCategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderHandlerRoutes = require('./routes/orderHandlerRoutes');
const handleLoginRoutes= require('./routes/handleLoginRoutes')
const contactRoutes= require('./routes/contactRoutes')
connectDB()
app.use(cors())

app.use(express.json())


app.use('/api/heroslides', heroSliderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/featured-categories', featuredCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderHandlerRoutes); 
app.use('/api/auth', handleLoginRoutes)
app.use('/api/contact', contactRoutes)
app.listen(PORT, (req, res)=>{
    console.log('server is running ')
})


