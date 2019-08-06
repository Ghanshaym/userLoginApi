const express = require('express');
const app = express();
const router = express.Router();
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const SERVER = require('./config/server')
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
userRoutes(app);
app.use('/check_api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(SERVER.PORT, () => {
    console.log("Running on port no " + SERVER.PORT)
})