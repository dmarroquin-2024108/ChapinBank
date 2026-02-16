const User = require('./field.model');
const bcrypt = require('bcrypt');


// REGISTRAR USUARIO
exports.registerUser = async (req, res) => {
    try {
        let { name, lastname, username, email, password, role } = req.body;

        // Normalizar datos
        username = username.toLowerCase().trim();
        email = email.toLowerCase().trim();

        // Verificar si existe usuario o email
        const existe = await User.findOne({ $or: [{ email }, { username }] });
        if (existe) {
            return res.status(400).json({ error: "El usuario o email ya están en uso" });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario
        const newUser = new User({
            name,
            lastname,
            username,
            email,
            password: hashedPassword,
            role: role || 'client'
        });

        await newUser.save();

        res.status(201).json({
            mensaje: "Usuario registrado exitosamente",
            usuario: {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role
            }
        });

    } catch (error) {
        res.status(500).json({
            error: "Hubo un error al registrar el usuario",
            detalle: error.message
        });
    }
};


// LISTAR USUARIOS
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// OBTENER USUARIO POR ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user)
            return res.status(404).json({ error: "Usuario no encontrado" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ACTUALIZAR USUARIO
exports.updateUser = async (req, res) => {
    try {
        const data = req.body;

        // Evitar que cambien rol directamente
        delete data.role;

        // Si envían password → encriptar
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            data,
            { new: true }
        ).select('-password');

        if (!user)
            return res.status(404).json({ error: "Usuario no encontrado" });

        res.json({
            mensaje: "Usuario actualizado",
            usuario: user
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ELIMINAR USUARIO
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user)
            return res.status(404).json({ error: "Usuario no encontrado" });

        res.json({ mensaje: "Usuario eliminado correctamente" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
