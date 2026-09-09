import sql from "mssql";

const config = {
    user: 'sa',          
    password: 'Prueba123*',    
    server: 'localhost',         
    database: 'mi_base_datos',
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    }, pool:{
        max: 10,
        min: 0,
        idleTimeoutMillis: 60000 // Se cuenta en milisegundos JAJSDJAS
    }
}

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado a la base de datos');
        return pool;
    }).catch(err => {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1);
    });
