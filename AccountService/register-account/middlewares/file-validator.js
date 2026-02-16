const { body, validationResult } = require("express-validator");

exports.registerValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Nombre requerido")
    .isLength({ min: 2 }).withMessage("Nombre muy corto"),

  body("lastname")
    .trim()
    .notEmpty().withMessage("Apellido requerido"),

  body("username")
    .trim()
    .notEmpty().withMessage("Username requerido")
    .isLength({ min: 4 }).withMessage("Minimo 4 caracteres"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email requerido")
    .isEmail().withMessage("Email inválido")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty().withMessage("Password requerido")
    .isLength({ min: 8 }).withMessage("Minimo 8 caracteres")
    .matches(/[A-Z]/).withMessage("Debe tener una mayúscula")
    .matches(/[0-9]/).withMessage("Debe tener un número"),
  
  body("cui")
    .trim()
    .notEmpty().withMessage("CUI requerido")
    .isNumeric().withMessage("CUI debe ser numérico")
    .isLength({ min: 13, max: 13 }).withMessage("CUI debe tener 13 dígitos"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
