const passport = require("passport");
const Usuarios = require("../models/Usuarios");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const crypto = require("crypto");
const bcrypt = require("bcrypt-nodejs");
const enviarEmail = require("../handler/email");

// Autenticar al usuario:

exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos campos son obligatorios",
});

// Revisar usuario logeado:
exports.usuarioAutenticado = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/iniciar-sesion");
};

// Cerrar sesion:
exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/iniciar-sesion");
  });
};

// Genera un Token si el usuario es valido
exports.enviarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!usuario) {
    req.flash("error", "No existe esa cuenta");
    res.redirect("/reestablecer");
  }

  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expiracion = Date.now() + 3600000;

  await usuario.save();

  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  await enviarEmail.enviar({
    usuario,
    subject: "Password Reset",
    resetUrl,
    archivo: "reestablecer-password"
  });

  req.flash("correcto", "Se envio un mensaje a tu e-mail")
  res.redirect("/iniciar-sesion")
};

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
    },
  });

  if (!usuario) {
    req.flash("error", "No valido");
    res.redirect("/reestablecer");
  }

  res.render("resetPassword", {
    nombrePagina: "Reestablecer Contraseña",
  });
};

exports.actualizarPassword = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        [Op.gte]: Date.now(),
      },
    },
  });

  //Verificar si el usuario existe
  if (!usuario) {
    req.flash("error", "No Valido");
    res.redirect("/reestablecer");
  }

  //Hashear el nuevo password
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  //Guardar el nuevo password
  await usuario.save();
  req.flash("correcto", "Tu password se ha actualizado");
  res.redirect("/iniciar-sesion");
};
