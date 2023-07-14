const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes');
const blogRouter = require('./routes/blogRoutes');
const typeRouter = require('./routes/typeRoutes');
const commentRouter = require('./routes/commentRoutes');
const loginRouter = require('./routes/loginRoutes');
const productRouter = require('./routes/productRoutes');
const { optionCors } = require('./config/corsConfig');

const app = express();

app.use(cors(optionCors));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/users', userRouter);
app.use('/blogs', blogRouter);
app.use('/types', typeRouter);
app.use('/comments', commentRouter);
app.use('/login', loginRouter);
app.use('/products', productRouter);

require('./db');
module.exports = { app };
