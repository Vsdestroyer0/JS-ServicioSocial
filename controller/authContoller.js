import { poolPromise } from "../db/db.js";

const registrar = async (req, res) =>{
    const { usuario, password, correo, telefono, id_rol } = req.body;

    if(!usuario || !password || !correo || telefono){
        return res.status(400).json({ message: "Datos faltantes"})
    }
    try{
        const pool = await poolPromise;
        const rolAsignado = id_rol || 2

        const datosEntrada = pool.request()
            .input('usuarioInput', sql.VarChar, usuario)
            .input('passwordInput', sql.VarChar, password)
            .input('correoInput', sql.VarChar, correo)
            .input('telefonoInput', sql.VarChar, telefono)
            .input('idRolInput', sql.TinyInt, rolAsignado)
            .query(`INSERT INTO tbl_usuario
                (usuario, password, cooreo, telefono, id_rol)
                VALUES (@usuarioInput, @passwordInput, @correoInput, 
                telefonoInput, @idRolInput)`);
  
    } catch{

    }
}

// Login
const login = async (req, res) => {
    const { correo, password } = req.body;

    if(!correo || !password){
        return res.status(400).json({ message: "correo y contraseña requeridos" })
    }

    try{
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('correoInput', sql.VarChar, correo)
            .request('select * from usuarios where correo = @correoInput')

        if(resultado.recordset.length === 0 || resultado.recordset[0].password !== password){
        return res.status(401).json({ message: "Correo o contraseña incorrectos" });
            }
        
        const usuario = resultado.recordset[0];

        res.cookie('auth', usuario.id, { 
            httpOnly: true, 
            secure: false, 
            maxAge: 3600000 
        }); 

        res.json({ 
            message: "Inicio de sesión exitoso", 
            usuario: { 
                id: usuario.id, 
                correo: usuario.correo } });

        } 
    catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

const getUser = async (req, res) => {
    const userId = req.cookies.auth;

    if(!userId){
        return res.status(401).json({ message: "No autenticado"});
    }

    try{
        const pool = await poolPromise;
        const resultado = await pool.request()
        .query("SELECT id, nombre, correo FROM Usuarios");

        const usuario = resultado.recordset();
        res.json ({ usuario });
    } catch {
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

export { login, getUser }