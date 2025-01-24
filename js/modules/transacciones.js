import { generarReferencia } from '../utils.js';
import { guardarCuenta, guardarMovimientos } from '../db.js';

// Consignar dinero a la cuenta del usuario logueado
export async function consignarDinero(cuentas, movimientos) {
    const numeroCuenta = prompt("Ingrese cuenta a consignar:");

    // Verificamos si la cuenta existe
    if (numeroCuenta in cuentas) {
        const valor = parseInt(prompt("¿Cuánto desea consignar a su cuenta?"), 10);

        if (valor <= 0) {
            console.log("El valor debe ser mayor a 0");
            return;
        }

        // Actualizamos el saldo en la cuenta correspondiente
        cuentas[numeroCuenta].saldo += valor;
        movimientos[numeroCuenta].push({
            tipo: "Consignacion",
            valor: valor,
            referencia: generarReferencia(),
            descripcion: "Consignación a su cuenta bancaria"
        });

        console.log(`Consignación exitosa. Su nuevo saldo es: ${cuentas[numeroCuenta].saldo}`);

        // Después de actualizar los datos en memoria
        await guardarCuenta(numeroCuenta, cuentas[numeroCuenta]);
        await guardarMovimientos(numeroCuenta, movimientos[numeroCuenta]);
    } else {
        console.log(`La cuenta ${numeroCuenta} no existe.`);
    }
}

// Consignar dinero a otra cuenta por número de cuenta o documento
export async function consignarDestinatario(cuentaOrigen, cuentas, movimientos, numeroCuentaActual) {
    const opc = parseInt(prompt("1. Consignar por número de cuenta\n2. Consignar por número de documento\nSeleccione una opción:"), 10);
    let cuentaDestinatario = null;

    if (opc === 1) {
        const numeroCuenta = prompt("Digite el número de cuenta del destinatario:");
        cuentaDestinatario = cuentas[numeroCuenta];
    } else if (opc === 2) {
        const numeroDocumento = parseInt(prompt("Digite el número de documento del destinatario:"), 10);
        cuentaDestinatario = Object.values(cuentas).find(cuenta => cuenta.documento === numeroDocumento);
    } else {
        console.log("Opción no válida");
        return;
    }

    if (cuentaDestinatario) {
        const valor = parseInt(prompt(`¿Cuánto desea consignar a la cuenta de ${cuentaDestinatario.nombre}?`), 10);

        if (valor > cuentaOrigen.saldo) {
            console.log("Fondos insuficientes para realizar la consignación");
        } else if (valor <= 0) {
            console.log("El valor a consignar debe ser mayor a cero");
        } else {
            cuentaOrigen.saldo -= valor;
            cuentaDestinatario.saldo += valor;

            movimientos[numeroCuentaActual].push({
                tipo: "Transferencia",
                valor: valor,
                referencia: generarReferencia(),
                descripcion: `Transferencia a cuenta de ${cuentaDestinatario.nombre}`
            });

            console.log(`Consignación exitosa. Su nuevo saldo es: ${cuentaOrigen.saldo}`);

            // Después de actualizar los datos en memoria
            await guardarCuenta(numeroCuentaActual, cuentas[numeroCuentaActual]);
            await guardarMovimientos(numeroCuentaActual, movimientos[numeroCuentaActual]);
        }
    } else {
        console.log("Cuenta no encontrada");
    }
}

// Retirar dinero de la cuenta logueada
export async function retirarDinero(cuenta, movimientos, numeroCuentaActual) {
    const valor = parseInt(prompt("¿Cuánto desea retirar de su cuenta?"), 10);

    if (valor > cuenta.saldo) {
        console.log("Fondos insuficientes");
    } else if (valor <= 0) {
        console.log("El valor a retirar debe ser mayor a cero");
    } else {
        cuenta.saldo -= valor;
        movimientos[numeroCuentaActual].push({
            tipo: "Retiro",
            valor: valor,
            referencia: generarReferencia(),
            descripcion: "Retiro de cuenta",
            cuenta: numeroCuentaActual
        });

        console.log(`Retiro exitoso. Su nuevo saldo es: ${cuenta.saldo}`);

        // Después de actualizar los datos en memoria
        await guardarCuenta(numeroCuentaActual, cuenta[numeroCuentaActual]);
        await guardarMovimientos(numeroCuentaActual, movimientos[numeroCuentaActual]);
    }
}

// Pagar servicios
export async function pagarServicios(cuenta, movimientos, numeroCuentaActual) {
    console.log("Seleccione el servicio que desea pagar:\n1. Agua\n2. Gas\n3. Energía");
    const servicios = { 1: "Agua", 2: "Gas", 3: "Energía" };
    const opc = parseInt(prompt("Ingrese su opción:"), 10);

    if (servicios[opc]) {
        const referencia = prompt("Ingrese la referencia del recibo:");
        const valor = parseInt(prompt("Ingrese el valor del recibo:"), 10);

        if (valor > cuenta.saldo) {
            console.log("Fondos insuficientes para pagar el servicio");
        } else if (valor <= 0) {
            console.log("El valor del recibo debe ser mayor a cero");
        } else {
            cuenta.saldo -= valor;
            movimientos[numeroCuentaActual].push({
                tipo: "Pago Servicio",
                valor: valor,
                referencia: referencia,
                descripcion: `Pago de servicio de ${servicios[opc]}`,
                cuenta: numeroCuentaActual
            });

            console.log(`Pago exitoso. Su nuevo saldo es: ${cuenta.saldo}`);

            // Después de actualizar los datos en memoria
            await guardarCuenta(numeroCuentaActual, cuenta[numeroCuentaActual]);
            await guardarMovimientos(numeroCuentaActual, movimientos[numeroCuentaActual]);
        }
    } else {
        console.log("Opción no válida");
    }
}