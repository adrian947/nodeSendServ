const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
const { validationResult } = require("express-validator");

exports.autenticarUsuario = async (req, res) => {
  //Revisar si hay errores

  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //Buscar usuario para ver si esta registrado
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    res.status(401).json({ msg: "El usuario no existe" });
    return next();
  }
  //verificar el password y autenticar el usuario

  if (bcrypt.compareSync(password, usuario.password)) {
    // crear Json Web Token
    const token = jwt.sign(
      {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
      process.env.SECRETA,
      {
        expiresIn: "8h",
      }
    );
    res.status(200).json({ msg: "Bienvenido!", token });
  } else {
    res.status(401).json({ msg: "Password Incorrecto!" });
  }
};

exports.usuarioAutenticado = async (req, res, next) => {
 
  res.json({usuario: req.usuario})
}
