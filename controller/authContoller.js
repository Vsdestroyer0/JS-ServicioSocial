import mssql from "mssql";
import { poolPromise } from "../db/db.js";

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

        } 
    catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
    
}

export { login }