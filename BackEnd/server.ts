import app, {setupWebSocket} from './app';

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

setupWebSocket(server);