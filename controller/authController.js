import { poolPromise, sql } from "../db/db.js";

const registrar = async (req, res) =>{
    const { usuario, password, correo, telefono, id_rol } = req.body;

    if(!usuario || !password || !correo || !telefono){
        return res.status(400).json({ message: "Datos faltantes"})
    }
    try{
        const pool = await poolPromise;
        const rolAsignado = id_rol || 2

        await pool.request()
            .input('usuarioInput', sql.VarChar, usuario)
            .input('passwordInput', sql.VarChar, password)
            .input('correoInput', sql.VarChar, correo)
            .input('telefonoInput', sql.VarChar, telefono)
            .input('idRolInput', sql.TinyInt, rolAsignado)
            .query(`INSERT INTO tbl_usuarios
                (usuario, password, correo, telefono, id_rol)
                VALUES (@usuarioInput, @passwordInput, @correoInput, 
                @telefonoInput, @idRolInput)`);

            
        return res.status(201).json({ message: "Has creado tu perfil correctamente"})
    } catch(e){
        if(e.number === 2627 || e.number === 2601){
            return res.status(400).json({ message: "Correo ya registrado"})
        }

        return res.status(500).json({ message: "Error en el servidor" })
    }
}

const login = async (req, res) => {
    const { correo, password } = req.body;

    if(!correo || !password){
        return res.status(400).json({ message: "correo y contraseña requeridos" })
    }

    try{
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('correoInput', sql.VarChar, correo)
            .query('select * from tbl_usuarios where correo = @correoInput')

        if(resultado.recordset.length === 0 || resultado.recordset[0].password !== password){
        return res.status(401).json({ message: "Correo o contraseña incorrectos" });
            }
        
        const usuario = resultado.recordset[0];

        res.cookie('auth', usuario.correo, { 
            httpOnly: true, 
            secure: false, 
            maxAge: 3600000 
        }); 

        res.json({ 
            message: "Inicio de sesión exitoso", 
            usuario: { 
                usuario:   usuario.usuario,
                id_rol: usuario.id_rol, 
                correo: usuario.correo
            } });

        } 
    catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

const getUser = async (req, res) => {
    const token = req.cookies.auth;

    if(!token){
        return res.status(401).json({ message: "No autenticado"});
    }

    try{
        const pool = await poolPromise;
        const resultado = await pool.request()
        .input('correoInput', sql.VarChar, token)
        .query(
            `SELECT usuario, correo, telefono, id_rol 
            FROM tbl_usuarios
            WHERE correo = @correoInput `);

        if(resultado.recordset.length === 0){
            return res.status(404).json({ message: "Usuario no encontrado"})
        }
        
        const usuario = resultado.recordset[0];
        res.json ({ usuario });
    } catch(e) {
        console.log(e)
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

const logout = async(req, res) => {
    res.clearCookie('auth')
    res.json({ message: "Sesion cerrada" })
}

export { login, getUser, registrar, logout }