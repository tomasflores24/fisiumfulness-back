const { Router } = require("express");
const loginController = require("../controllers/loginController");
const loginRouter = Router();

loginRouter.post("/", loginController.login); // Cambio aquí
loginRouter.post("/recover-password", loginController.recoverAccount);

module.exports = loginRouter;

