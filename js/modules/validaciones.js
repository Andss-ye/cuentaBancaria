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

// Validar si el documento ya existe
export function validacionDocumento(cuentas) {
    while (true) {
        const documento = parseInt(prompt("Ingrese su número de documento: "), 10);
        const documentoExiste = Object.values(cuentas).some(cuenta => cuenta.documento === documento);

        if (!documentoExiste) {
            return documento;
        } else {
            console.log("El documento ya existe, ingrese otro.");
        }
    }
}