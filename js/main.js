// Importar módulos
import { crearCuenta, login, mostrarCuenta, consultarMovimientos } from './modules/cuentas.js';
import { consignarDinero, consignarDestinatario, retirarDinero, pagarServicios } from './modules/transacciones.js';
import { initDB, obtenerCuentas, obtenerMovimientos } from './db.js';

let movimientos = {};
let cuentas = {};
let cuentaActual = null;

const menuPrincipal = document.getElementById('menuPrincipal');
const loginForm = document.getElementById('loginForm');
const menuCliente = document.getElementById('menuCliente');
const modal = document.getElementById('modal');

// Inicialización
async function inicializarDatos() {
    try {
        await initDB();
        cuentas = await obtenerCuentas() || {};
        movimientos = await obtenerMovimientos() || {};
        console.log('Base de datos inicializada:', { cuentas, movimientos });
    } catch (error) {
        mostrarModal('Error', 'Error al cargar datos: ' + error.message);
    }
}

// Función para mostrar modal
function mostrarModal(titulo, mensaje) {
    document.getElementById('modalTitle').textContent = titulo;
    document.getElementById('modalMessage').textContent = mensaje;
    modal.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', async () => {
    await inicializarDatos();

    document.getElementById('btnCrearCuenta').addEventListener('click', async () => {
        try {
            const mensaje = await crearCuenta(cuentas, movimientos);
            mostrarModal('Éxito', mensaje);
            cuentas = await obtenerCuentas();
            movimientos = await obtenerMovimientos();
        } catch (error) {
            mostrarModal('Error', error.message);
        }
    });

    document.getElementById('btnConsignar').addEventListener('click', async () => {
        try {
            await consignarDinero(cuentas, movimientos);
            cuentas = await obtenerCuentas();
            movimientos = await obtenerMovimientos();
        } catch (error) {
            mostrarModal('Error', error.message);
        }
    });

    document.getElementById('btnLogin').addEventListener('click', () => {
        menuPrincipal.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Manejo del login
    document.getElementById('btnSubmitLogin').addEventListener('click', async () => {
        const numeroCuenta = document.getElementById('numeroCuenta').value;
        const clave = document.getElementById('clave').value;
        
        if (cuentas[numeroCuenta] && cuentas[numeroCuenta].clave === clave) {
            cuentaActual = numeroCuenta;
            loginForm.classList.add('hidden');
            menuCliente.classList.remove('hidden');
            
            // Actualizar el título del menú cliente con la información de la cuenta
            const menuClienteTitle = document.querySelector('#menuCliente h2');
            menuClienteTitle.innerHTML = `
                Bienvenido(a) ${cuentas[numeroCuenta].nombre}<br>
                <span class="text-sm text-gray-600">
                    Cuenta: ${numeroCuenta}<br>
                    Saldo: $${cuentas[numeroCuenta].saldo.toLocaleString()}
                </span>
            `;
        } else {
            mostrarModal('Error', 'Credenciales incorrectas');
        }
    });

    document.getElementById('btnBackLogin').addEventListener('click', () => {
        loginForm.classList.add('hidden');
        menuPrincipal.classList.remove('hidden')
    })

    // Botones del menú cliente
    document.getElementById('btnConsignarOtra').addEventListener('click', async () => {
        try {
            await consignarDestinatario(cuentas[cuentaActual], cuentas, movimientos, cuentaActual);
        } catch (error) {
            mostrarModal('Error', error.message);
        }
    });

    // Agregar botón de cerrar sesión
    document.getElementById('btnCerrarSesion').addEventListener('click', () => {
        cuentaActual = null;
        menuCliente.classList.add('hidden');
        menuPrincipal.classList.remove('hidden');
        document.getElementById('numeroCuenta').value = '';
        document.getElementById('clave').value = '';
    });

    // Agregar los event listeners faltantes del menú cliente
    document.getElementById('btnRetirar').addEventListener('click', async () => {
        try {
            await retirarDinero(cuentas[cuentaActual], movimientos, cuentaActual);
            cuentas = await obtenerCuentas();
            movimientos = await obtenerMovimientos();
        } catch (error) {
            mostrarModal('Error', error.message);
        }
    });

    document.getElementById('btnPagarServicios').addEventListener('click', async () => {
        try {
            await pagarServicios(cuentas[cuentaActual], movimientos, cuentaActual);
            cuentas = await obtenerCuentas();
            movimientos = await obtenerMovimientos();
        } catch (error) {
            mostrarModal('Error', error.message);
        }
    });

    document.getElementById('btnConsultarMovimientos').addEventListener('click', () => {
        try {
            consultarMovimientos(cuentaActual, movimientos);
        } catch (error) {
            mostrarModal('Error', error.message);
        }
    });

    // Cerrar modal
    document.getElementById('modalClose').addEventListener('click', () => {
        modal.classList.add('hidden');
    });
});