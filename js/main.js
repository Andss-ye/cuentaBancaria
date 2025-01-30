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
export function mostrarModal(titulo, mensaje) {
    document.getElementById('modalTitle').textContent = titulo;
    document.getElementById('modalMessage').textContent = mensaje;
    modal.classList.remove('hidden');
}

// Función para actualizar la información del usuario en el menú
function actualizarInfoUsuario(numeroCuenta) {
    const menuClienteTitle = document.querySelector('#menuCliente h2');
    menuClienteTitle.innerHTML = `
        Bienvenido(a) ${cuentas[numeroCuenta].nombre}<br>
        <span class="text-sm text-gray-600">
            Cuenta: ${numeroCuenta}<br>
            Saldo: $${cuentas[numeroCuenta].saldo.toLocaleString()}
        </span>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    await inicializarDatos();

    document.getElementById('btnCrearCuenta').addEventListener('click', () => {
        menuPrincipal.classList.add('hidden');
        document.getElementById('crearCuentaForm').classList.remove('hidden');
    });

    document.getElementById('btnSubmitCrearCuenta').addEventListener('click', async () => {
        try {
            const nombre = document.getElementById('nombreCrearCuenta').value;
            const documento = parseInt(document.getElementById('documentoCrearCuenta').value);
            const clave = document.getElementById('claveCrearCuenta').value;
            
            const mensaje = await crearCuenta(nombre, documento, clave, cuentas, movimientos);
            mostrarModal('Éxito', mensaje);
            
            // Limpiar y ocultar el formulario
            document.getElementById('nombreCrearCuenta').value = '';
            document.getElementById('documentoCrearCuenta').value = '';
            document.getElementById('claveCrearCuenta').value = '';
            document.getElementById('crearCuentaForm').classList.add('hidden');
            menuPrincipal.classList.remove('hidden');
            
            cuentas = await obtenerCuentas();
            movimientos = await obtenerMovimientos();
            actualizarInfoUsuario(cuentaActual);
        } catch (error) {
            mostrarModal('Error', error.message);
        }
    });

    document.getElementById('btnBackCrearCuenta').addEventListener('click', () => {
        document.getElementById('crearCuentaForm').classList.add('hidden');
        menuPrincipal.classList.remove('hidden');
    });

    // Para el formulario de consignación
    document.getElementById('btnConsignar').addEventListener('click', () => {
        menuPrincipal.classList.add('hidden');
        document.getElementById('consignarForm').classList.remove('hidden');
    });

    document.getElementById('btnSubmitConsignar').addEventListener('click', async () => {
        try {
            const numeroCuenta = document.getElementById('cuentaConsignar').value;
            const valor = parseInt(document.getElementById('valorConsignar').value);
            
            await consignarDinero(numeroCuenta, valor, cuentas, movimientos);
            
            // Actualizar datos
            cuentas = await obtenerCuentas();
            movimientos = await obtenerMovimientos();
            actualizarInfoUsuario(cuentaActual);
            
            // Limpiar y ocultar el formulario
            document.getElementById('cuentaConsignar').value = '';
            document.getElementById('valorConsignar').value = '';
            document.getElementById('consignarForm').classList.add('hidden');
            menuPrincipal.classList.remove('hidden');
            
        } catch (error) {
            mostrarModal('Error', error.message);
        }
    });

    document.getElementById('btnBackConsignar').addEventListener('click', () => {
        document.getElementById('consignarForm').classList.add('hidden');
        menuPrincipal.classList.remove('hidden');
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

    // Event listeners para Consignar a Destinatario
    document.getElementById('btnConsignarOtra').addEventListener('click', () => {
        menuCliente.classList.add('hidden');
        document.getElementById('consignarDestinatarioForm').classList.remove('hidden');
    });

    document.getElementById('metodoBusqueda').addEventListener('change', (e) => {
        const label = document.querySelector('[for="destinatarioInput"]');
        if (e.target.value === '1') {
            label.textContent = 'Número de Cuenta';
        } else {
            label.textContent = 'Número de Documento';
        }
    });

    document.getElementById('btnSubmitConsignarDestinatario').addEventListener('click', async () => {
        try {
            const metodoBusqueda = document.getElementById('metodoBusqueda').value;
            const destinatario = document.getElementById('destinatarioInput').value;
            const valor = parseInt(document.getElementById('valorConsignarDestinatario').value);
            
            await consignarDestinatario(cuentas[cuentaActual], cuentas, movimientos, cuentaActual, {
                metodoBusqueda,
                destinatario,
                valor
            });
            
            // Actualizar datos
            cuentas = await obtenerCuentas();
            movimientos = await obtenerMovimientos();
            actualizarInfoUsuario(cuentaActual);
            
            // Limpiar y ocultar formulario
            document.getElementById('destinatarioInput').value = '';
            document.getElementById('valorConsignarDestinatario').value = '';
            document.getElementById('consignarDestinatarioForm').classList.add('hidden');
            menuCliente.classList.remove('hidden');
            
        } catch (error) {
            mostrarModal('Error', error.message);
        }
    });

    // Event listeners para Retirar Dinero
    document.getElementById('btnRetirar').addEventListener('click', () => {
        menuCliente.classList.add('hidden');
        document.getElementById('retirarForm').classList.remove('hidden');
    });

    document.getElementById('btnSubmitRetirar').addEventListener('click', async () => {
        try {
            const valor = parseInt(document.getElementById('valorRetirar').value);
            
            await retirarDinero(cuentas[cuentaActual], movimientos, cuentaActual, valor);
            
            // Actualizar datos
            cuentas = await obtenerCuentas();
            movimientos = await obtenerMovimientos();
            actualizarInfoUsuario(cuentaActual);
            
            // Limpiar y ocultar formulario
            document.getElementById('valorRetirar').value = '';
            document.getElementById('retirarForm').classList.add('hidden');
            menuCliente.classList.remove('hidden');
            
        } catch (error) {
            mostrarModal('Error', error.message);
        }
    });

    // Event listeners para Pagar Servicios
    document.getElementById('btnPagarServicios').addEventListener('click', () => {
        menuCliente.classList.add('hidden');
        document.getElementById('pagarServiciosForm').classList.remove('hidden');
    });

    document.getElementById('btnSubmitPagarServicio').addEventListener('click', async () => {
        try {
            const tipoServicio = document.getElementById('tipoServicio').value;
            const referencia = document.getElementById('referenciaServicio').value;
            const valor = parseInt(document.getElementById('valorServicio').value);
            
            await pagarServicios(cuentas[cuentaActual], movimientos, cuentaActual, {
                tipoServicio,
                referencia,
                valor
            });
            
            // Actualizar datos
            cuentas = await obtenerCuentas();
            movimientos = await obtenerMovimientos();
            actualizarInfoUsuario(cuentaActual);
            
            // Limpiar y ocultar formulario
            document.getElementById('referenciaServicio').value = '';
            document.getElementById('valorServicio').value = '';
            document.getElementById('pagarServiciosForm').classList.add('hidden');
            menuCliente.classList.remove('hidden');
            
        } catch (error) {
            mostrarModal('Error', error.message);
        }
    });

    // Botones de regresar
    document.getElementById('btnBackConsignarDestinatario').addEventListener('click', () => {
        document.getElementById('consignarDestinatarioForm').classList.add('hidden');
        menuCliente.classList.remove('hidden');
    });

    document.getElementById('btnBackRetirar').addEventListener('click', () => {
        document.getElementById('retirarForm').classList.add('hidden');
        menuCliente.classList.remove('hidden');
    });

    document.getElementById('btnBackPagarServicio').addEventListener('click', () => {
        document.getElementById('pagarServiciosForm').classList.add('hidden');
        menuCliente.classList.remove('hidden');
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