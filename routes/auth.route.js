import { Router } from "express";
import {
    login,
    register,
    infoUser,
    refreshToken,
    logout
} from "../controllers/auth.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import { body } from "express-validator";

import { validationResultExpress } from "../middlewares/validationResultExpress.js";

const router = Router();

router.post(
	"/register", 
	[ 
		body("email", "Formato de email incorrecto !!!").trim().isEmail().normalizeEmail(),
		body("password", "Contrasena minimo 6 caracteres")
            .trim()
            .isLength({ min: 6 })
            .custom((value, { req }) => {
				if(!req.body.repassword) {
					throw new Error("Error: No se ha repetido la contrasena");
				}
				
				if (value !== req.body.repassword) {
					throw new Error("Error: No coinciden las contrasenas");
				}
				
				return value;
            })
	], // la variable body dentro del array se coge del express.validator
	validationResultExpress,
	register
);

router.post(
    "/login",
    [
        body("email", "Ingrese un email valido")
            .trim()
            .isEmail()
            .normalizeEmail(),
        body("password", "Contrasena minimo 6 carácteres")
            .trim()
            .isLength({ min: 6 }),
    ],
    validationResultExpress,
    login
);

router.post("/login", login);
router.get("/protected", requireToken, infoUser);
router.get("/refresh", refreshToken);
router.get("/logout", logout);

export default router;