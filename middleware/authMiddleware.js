import { poolPromise, sql } from "../db/db";

const reqRol = (...rolesPermitidos) => { 
    return async (req, res, next) => {
        const token = req.cookies.auth;

        if(!token){
            return res.status(401).json({ message: "No hay cookie de autenticación" });
        }

        try{
            const pool = await poolPromise;

            const resultado = await pool.request()
            .input('correoI', sql.VarChar, token)
            .query(`SELECT id_rol
                FROM tbl_usuarios
                WHERE correo = @correoI`)

            if(!resultado.recordset[0]){
                return res.status(401).json({ message: "No se encontró ningun usuario"})
            }

            const usuario = resultado.recordset[0];
            
            if(!rolesPermitidos.includes(usuario.id_rol)){
                return res.status(403).json({ message: "No tienes acceso a esta página" })
            }

            next();
        }
        catch(e){
            throw e
        }
    }
}
export { reqRol }