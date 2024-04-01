/**
 * Módulo cliente para enviar comandos al servidor a través de sockets.
 * Se conecta al servidor en el puerto especificado y envía un comando
 * proporcionado por el usuario desde la línea de comandos.
 * Recibe la respuesta del servidor y la muestra en la consola.
 */
import net from 'net';

const PORT = 60300;
const HOST = 'localhost';

if (process.argv.length < 3) {
    console.error('Por favor, proporciona un comando para ejecutar en el servidor.');
    process.exit(1);
}

// Obtener el comando y sus argumentos de la línea de comandos
const command = process.argv.slice(2).join(' ');

// Crear una conexión con el servidor
const client = net.connect(PORT, HOST, () => {
    console.log(`Conexión establecida con el servidor en ${HOST}:${PORT}`);

    // Enviar el comando al servidor
    client.write(command);
});

// Recibir la respuesta del servidor
client.on('data', (data) => {
    console.log(`Respuesta del servidor: ${data.toString()}`);
});

// Manejar errores de conexión
client.on('error', (error) => {
    console.error(`Error de conexión: ${error.message}`);
});

// Manejar el cierre de la conexión
client.on('close', () => {
    console.log('Conexión cerrada.');
});
