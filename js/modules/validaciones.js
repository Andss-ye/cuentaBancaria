import { generarNumeroCuenta } from '../utils.js';

// Validar si el número de cuenta ya existe
export function validacionCuenta(cuentas) {
    while (true) {
        const numeroCuenta = generarNumeroCuenta();
        if (!cuentas.hasOwnProperty(numeroCuenta)) {
            return numeroCuenta;
        } else {
            console.log("El número de cuenta ya existe, se generará uno nuevo.");
        }
    }
}
