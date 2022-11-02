mongoDB

valeriano

XPFzWTIKvaHkEaRP

https://www.youtube.com/watch?v=VrLvbzHVT9A

https://github.com/bluuweb/api-rest-twitch-2022-mongo-express-node-jwt

https://bluuweb.github.io/desarrollo-web-bluuweb/21-03-api-rest/#requisitos

FLUJO:

1.- En el login, llamamos a generar token y a generar token refresh, el primero con una duracion corta o muy corta, el segundo con la duracion que queramos, generalmente mas larga. No enviamos cookies desde aqui.
2.- En el archivo /middlewares/requireToken.js preguntamos por req.headers?.authorization, ya que en las rutas protegidas, seguimos enviando las peticiones con el parametro Authorization de los headers y con su correspondiente valor Bearer + token, y este es el unico sitio desde donde se envia el token, no se envia nunca con res.cookies.
3.- En el archivo /utils/tokenManager.js tenemos la funcion generateRefreshToken, en la cual SI enviamos las cookies con res.cookies, pero enviamos el refresh token, no el token normal que usamos para hacer las peticiones.
4.- En cada ruta protegida, primero hacemos una request a la ruta del refresh token, y a continuación la request correspondiente que necesitamos para ver esa ruta protegida en concreto (en nuestro caso la ruta protected, gestionada en la funcion infoUser que tenemos en el arhivo /controllers/auth-controller.js)

