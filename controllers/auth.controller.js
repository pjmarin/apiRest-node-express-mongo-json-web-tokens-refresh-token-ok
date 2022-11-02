import jwt from "jsonwebtoken";
import { generateToken, generateRefreshToken, tokenVerificationErrors } from "../utils/tokenManager.js";
import { User } from "../models/User.js";

export const register = async (req, res) => {
	const { email, password } = req.body;
	
	try {
		// const user = new User({email, password}); // solo para la alternativa 1, instanciamos el user primero, y despues directamente hariamos un await user.save() para guardarlo en mongo
		
		// alternativa 2 --> preguntar primero si el usuario existe antes de guardarlo
		let user = await User.findOne({email});
		if(user) {
			// throw({code: 11000});
			return res.status(400).json({error: `El usuario ${email} ya existe !!!`, code: 11000});
		}
		
		// si utilizamos la alternativa 2, debemos crear el user nuevo antes de guardarlo en mongo
		const newUser = new User({email, password});
		
		await newUser.save();
		
		// jwt token
		
		res.status(201).json({endpoint: "register", email, password, message: `Usuario ${email} creado correctamente !!!`});
	} catch(err) {
		return res.status(500).json({error: `Server error: ${err}`});
		// alternativa 1 - utilizar el validador de mongo (cuando ponemos unique como propiedad en un campo del schema) 
		// y confiar en que cuando existe un user, el codigo de error siempre sera 11000
		//if(err.code === 11000) {
			//return res.status(400).json({ error: `Ya existe el usuario ${email}. Por favor crea un usuario nuevo.` });
		//}
		// return res.status(500).json({error: `Server error: ${err}`});
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
			
		let user = await User.findOne({email});
		
		if(!user) {
			return res.status(401).json({status: "Unauthorized", error: `Error: El usuario ${email} no existe !!!`});
		}
		
		const respuestaPassword = await user.comparePassword(password);
		if(!respuestaPassword) {
			return res.status(400).json({error: `Usuario o contrasena incorrecto/a !!!`});
		}
		
		// Generar el token jwt
		const { token, expiresIn } = generateToken(user._id);
		// Generar el refresh
		generateRefreshToken(user._id, res);

		res.status(200).send({endpoint: "login", body: req.body || "req.body vacio o ha habido algun error", token});
	} catch(err) {
		return res.status(500).json({error: `Ha habido algun error al intentar hacer login ${err}`});
	}
};

export const infoUser = async (req, res) => {	
	try {
		const user = await User.findById(req.uid).lean(); // .lean() nos devuelve un objeto plano de javascript en lugar de un objeto de mongo, por lo tanto la consulta es mas liviana
		res.status(200).json({id: user._id, user: user.email });
	} catch(err) {
		return res.status(500).json({error: `Ha habido algun error despues de haber pasado la validacion de token y dentro de la pagina protegida ${err}`});
	}
	
	
};

export const refreshToken = (req, res) => {
	try {
		const refreshTokenCookie  = req.cookies?.refreshToken;

		if(!refreshTokenCookie ) {
			throw new Error("No existe el token");
		}
		
		const { uid } = jwt.verify(refreshTokenCookie , process.env.JWT_REFRESH);
		
		const { token, expiresIn } = generateToken(uid);
		
		return res.json({ token, expiresIn});
	} catch(err) {		
		return res
				.status(401)
				.send({ error: tokenVerificationErrors[err.message] });
	}
};

export const logout = (req, res) => {};