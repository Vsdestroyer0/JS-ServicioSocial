import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true   
}));
app.use(express.json());
app.use(cookieParser());

const server = 3005

app.listen(server, () => {
    console.log(`Servidor escuchando en http://localhost:${server}`);
})