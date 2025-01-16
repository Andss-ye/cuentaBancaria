// Importar módulos
import { crearCuenta, login, mostrarCuenta, consultarMovimientos } from './modules/cuentas.js';
import { consignarDinero, consignarDestinatario, retirarDinero, pagarServicios } from './modules/transacciones.js';

// Menú principal
function menu() {
    console.log('=============================================');
    console.log('BIENVENIDO AL SISTEMA\n 1. Crear cuenta\n 2. Realizar consignación \n 3. Login\n 0. Salir del programa');
    const opc = parseInt(prompt('Ponga una opción:'));
    return opc;
}

// Menú de cliente
function menuCliente() {
    console.log('=============================================');
    console.log('BIENVENIDO AL LOGIN\n 1. Consignar dinero a una cuenta\n 2. Retirar dinero de su cuenta\n 3. Pagar servicios \n 4. Consultar movimientos \n 0. Salir de la cuenta');
    console.log('=============================================');
    const opc = parseInt(prompt('Ponga una opción:'));
    return opc;
}

// Datos iniciales
const movimientos = {};
const cuentas = {};

// Ejecución del programa
let opc = 10;

while (opc !== 0) {
    try {
        opc = menu();
        switch (opc) {
            case 1:
                console.log('\nCrear cuenta\n');
                console.log(crearCuenta(cuentas, movimientos));
                break;
            case 2:
                console.log('\nConsignar a mi cuenta\n');
                consignarDinero(cuentas, movimientos); // Pasamos 'cuentas' y 'movimientos'
                break;
            case 3:
                console.log('\nLogin');
                const numeroCuentaActual = login(cuentas); // Obtener el número de cuenta
                const cuentaActual = cuentas[numeroCuentaActual]; // Buscar la cuenta en el diccionario

                if (cuentaActual) {
                    let opcCliente = 10;
                    while (opcCliente !== 0) {
                        opcCliente = menuCliente();
                        switch (opcCliente) {
                            case 1:
                                console.log('\nConsignar a otra cuenta');
                                consignarDestinatario(cuentaActual, cuentas, movimientos, numeroCuentaActual);
                                break;
                            case 2:
                                console.log('\nRetirar de su cuenta\n');
                                retirarDinero(cuentaActual, movimientos, numeroCuentaActual);
                                break;
                            case 3:
                                console.log('\nPagar servicios\n');
                                pagarServicios(cuentaActual, movimientos, numeroCuentaActual);
                                break;
                            case 4:
                                console.log('\nConsultar movimientos\n');
                                consultarMovimientos(numeroCuentaActual, movimientos);
                                break;
                            case 5:
                                mostrarCuenta(cuentas); // Función de prueba
                                break;
                            case 6:
                                console.log(movimientos);
                                console.log(cuentas);
                                console.log(cuentaActual);
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
                process.exit();
                break;
            default:
                console.log('\nEscoja 0 a 3\n ');
        }
    } catch (error) {
        console.log('\nLa opción tiene que ser un número\n');
    }
}
