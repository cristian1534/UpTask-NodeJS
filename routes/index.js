const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const tareaController = require("../controllers/tareaController");
const usuarioController = require("../controllers/usuarioController");
const authController = require("../controllers/authController");

//express validator
const { body } = require("express-validator/check");

module.exports = function () {
  //Crear proyecto
  router.get(
    "/",
    authController.usuarioAutenticado,
    projectController.projectHome
  );
  router.get(
    "/nuevo-proyecto",
    authController.usuarioAutenticado,
    projectController.formularioProyecto
  );
  router.post(
    "/nuevo-proyecto",
    body("nombre").not().isEmpty().trim().escape(),
    authController.usuarioAutenticado,
    projectController.nuevoProyecto
  );

  //Listar proyecto
  router.get(
    "/proyectos/:url",
    authController.usuarioAutenticado,
    projectController.projectPorUrl
  );

  //Actualizar proyecto
  router.get("/proyecto/editar/:id", projectController.formularioEditar);
  router.post(
    "/nuevo-proyecto/:id",
    body("nombre").not().isEmpty().trim().escape(),
    authController.usuarioAutenticado,
    projectController.actualizarProyecto
  );

  //Eliminar proyecto
  router.delete("/proyectos/:url", authController.usuarioAutenticado, projectController.eliminarProyecto);

  //Crear Tarea
  router.post("/proyectos/:url", authController.usuarioAutenticado, tareaController.crearTarea);

  //Actualizar Tarea
  router.patch("/tareas/:id", authController.usuarioAutenticado,  tareaController.actualizarTarea);

  //Eliminar Tarea
  router.delete("/tareas/:id", authController.usuarioAutenticado, tareaController.eliminarTarea);

  //Crear nueva cuenta
  router.get("/crear-cuenta", usuarioController.formCrearCuenta);
  router.post("/crear-cuenta", usuarioController.crearCuenta);
  

  //Iniciar sesión
  router.get("/iniciar-sesion", usuarioController.formIniciarSesion);
  router.post("/iniciar-sesion", authController.autenticarUsuario);
  
  //Cerrar sesion
  router.get("/cerrar-sesion", authController.cerrarSesion);

  //Reestablecer contraseña
  router.get("/reestablecer", usuarioController.formReestablecerPassword);
  router.post("/reestablecer", authController.enviarToken);
  router.get("/reestablecer/:token", authController.validarToken);
  router.post("/reestablecer/:token", authController.actualizarPassword);


  return router;
};
