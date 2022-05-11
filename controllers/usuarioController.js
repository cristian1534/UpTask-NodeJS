const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handler/email");

exports.formCrearCuenta = (req, res) => {
  res.render("crearCuenta", {
    nombrePagina: "Crear Cuenta en UpTask",
  });
};

exports.crearCuenta = async (req, res) => {
  const { email, password } = req.body;

  try {
    await Usuarios.create({
      email,
      password,
    });

    res.redirect("/iniciar-sesion");
  } catch (error) {
    req.flash(
      "error",
      error.errors.map((error) => error.message)
    );
    res.render("crearCuenta", {
      mensajes: req.flash(),
      nombrePagina: "Crear Cuenta en UpTask",
      email,
      password,
    });
  }
};

exports.formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes;
  res.render("iniciarSesion", {
    nombrePagina: "Iniciar Sesion en UpTask",
    error,
  });
};

exports.formReestablecerPassword = (req, res) => {
  res.render("reestablecer", {
    nombrePagina: "Reestablecer tu Contraseña",
  });
};
