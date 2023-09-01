const path = require('path')

const Service = require('node-windows').Service

// Crea un nuevo objeto de servicio
const svc = new Service({
  name: 'NestJS Backend', // El nombre del servicio
  description: 'Un servicio de Windows para ejecutar el backend en NestJS', // La descripción del servicio
  script: './server.js', // La ruta al archivo compilado de tu aplicación NestJS
  nodeOptions: [
    // Opciones adicionales para Node.js
    '--harmony',
    '--max_old_space_size=4096',
  ],
})

// Escucha los eventos del servicio
svc.on('install', function () {
  svc.start() // Inicia el servicio una vez instalado
})

svc.on('uninstall', function () {
  console.log('Uninstall complete.')
  console.log('The service exists: ', svc.exists)
})

svc.on('start', function () {
  console.log(
    svc.name + ' started!\nVisit http://127.0.0.1:8000 to see it in action.'
  )
})

svc.on('stop', function () {
  console.log(svc.name + ' stopped!')
})

svc.on('error', function (err) {
  console.log('Error: ', err)
})
// Instala el servicio
svc.install()
