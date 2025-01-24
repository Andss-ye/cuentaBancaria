// Importar módulos
import { crearCuenta, login, mostrarCuenta, consultarMovimientos } from './modules/cuentas.js';
import { consignarDinero, consignarDestinatario, retirarDinero, pagarServicios } from './modules/transacciones.js';
import { initDB, obtenerCuentas, obtenerMovimientos } from './db.js';

// Variables globales para los datos
let movimientos = {};
let cuentas = {};

// Cargar datos al inicio
async function inicializarDatos() {
    try {
        await initDB();
        cuentas = await obtenerCuentas() || {};
        movimientos = await obtenerMovimientos() || {};
        console.log('Base de datos inicializada:', { cuentas, movimientos });
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

// Ejecución del programa
async function iniciarPrograma() {
    await inicializarDatos();
    let opc = 10;

    while (opc !== 0) {
        try {
            opc = menu();
            switch (opc) {
                case 1:
                    console.log('\nCrear cuenta\n');
                    const mensaje = await crearCuenta(cuentas, movimientos);
                    console.log(mensaje);
                    // Actualizar datos locales después de crear cuenta
                    cuentas = await obtenerCuentas();
                    movimientos = await obtenerMovimientos();
                    break;
                case 2:
                    console.log('\nConsignar a mi cuenta\n');
                    await consignarDinero(cuentas, movimientos);
                    break;
                case 3:
                    console.log('\nLogin');
                    const numeroCuentaActual = login(cuentas);
                    const cuentaActual = cuentas[numeroCuentaActual];

                    if (cuentaActual) {
                        let opcCliente = 10;
                        while (opcCliente !== 0) {
                            opcCliente = menuCliente();
                            switch (opcCliente) {
                                case 1:
                                    console.log('\nConsignar a otra cuenta');
                                    await consignarDestinatario(cuentaActual, cuentas, movimientos, numeroCuentaActual);
                                    break;
                                case 2:
                                    console.log('\nRetirar de su cuenta\n');
                                    await retirarDinero(cuentaActual, movimientos, numeroCuentaActual);
                                    break;
                                case 3:
                                    console.log('\nPagar servicios\n');
                                    await pagarServicios(cuentaActual, movimientos, numeroCuentaActual);
                                    break;
                                case 4:
                                    consultarMovimientos(numeroCuentaActual, movimientos);
                                    break;
                                case 0:
                                    console.log('\nSaliendo...');
                                    break;
                                default:
                                    console.log('\nEscoja una opción válida\n');
                            }
                        }
                    } else {
                        console.log('\nDatos incorrectos, verifíquelos\n');
                    }
                    break;
                case 0:
                    console.log('\nSaliendo...');
                    break;
                default:
                    console.log('\nEscoja 0 a 3\n');
            }
        } catch (error) {
            console.error('Error en el programa:', error);
            console.log('\nOcurrió un error. Por favor, intente nuevamente.\n');
        }
    }
}

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const btnIniciar = document.getElementById('iniciar');
    btnIniciar.addEventListener('click', iniciarPrograma);
});

// Funciones de menú
function menu() {
    console.log('=============================================');
    console.log('BIENVENIDO AL SISTEMA\n 1. Crear cuenta\n 2. Realizar consignación \n 3. Login\n 0. Salir del programa');
    const opc = parseInt(prompt('Ponga una opción:'));
    return opc;
}

function menuCliente() {
    console.log('=============================================');
    console.log('BIENVENIDO AL LOGIN\n 1. Consignar dinero a una cuenta\n 2. Retirar dinero de su cuenta\n 3. Pagar servicios \n 4. Consultar movimientos \n 0. Salir de la cuenta');
    console.log('=============================================');
    const opc = parseInt(prompt('Ponga una opción:'));
    return opc;
}