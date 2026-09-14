import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/authRoutes.js";

const app = express();

app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true   
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/', router);

const server = 3000

app.listen(server, () => {
    console.log(`Servidor escuchando en http://localhost:${server}`);
})