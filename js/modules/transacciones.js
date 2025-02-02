import { generarReferencia } from '../utils.js';
import { guardarCuenta, guardarMovimientos } from '../db.js';
import { mostrarModal } from '../main.js'

// Consignar dinero a la cuenta del usuario logueado
export async function consignarDinero(numeroCuenta, valor, cuentas, movimientos) {
    if (!(numeroCuenta in cuentas)) {
        throw new Error('La cuenta no existe');
    }
    
    if (valor <= 0) {
        throw new Error('El valor debe ser mayor a 0');
    }
    
    // Actualizar saldo
    cuentas[numeroCuenta].saldo += valor;
    if (!movimientos[numeroCuenta]) {
        movimientos[numeroCuenta] = [];
    }
    
    movimientos[numeroCuenta].push({
        tipo: "Consignacion",
        valor: valor,
        referencia: generarReferencia(),
        descripcion: "Consignación a su cuenta bancaria"
    });
    
    await guardarCuenta(numeroCuenta, cuentas[numeroCuenta]);
    await guardarMovimientos(numeroCuenta, movimientos[numeroCuenta]);

    return `Se consigno $${valor} a la cuenta ${numeroCuenta}`
}

// Consignar dinero a otra cuenta por número de cuenta o documento
export async function consignarDestinatario(cuentaOrigen, cuentas, movimientos, numeroCuentaActual, datos) {
    let cuentaDestinatario = null;
    let numeroCuentaDestinatario = null;

    if (datos.metodoBusqueda === '1') {
        numeroCuentaDestinatario = datos.destinatario;
        cuentaDestinatario = cuentas[numeroCuentaDestinatario];
    } else if (datos.metodoBusqueda === '2') {
        const numeroDocumento = parseInt(datos.destinatario);
        for (const [numCuenta, cuenta] of Object.entries(cuentas)) {
            if (cuenta.documento === numeroDocumento) {
                cuentaDestinatario = cuenta;
                numeroCuentaDestinatario = numCuenta;
                break;
            }
        }
    } else {
        throw new Error("Método de búsqueda no válido");
    }

    if (!cuentaDestinatario || !numeroCuentaDestinatario) {
        throw new Error("Cuenta no encontrada");
    }

    if (datos.valor > cuentaOrigen.saldo) {
        throw new Error("Fondos insuficientes para realizar la consignación");
    }
    
    if (datos.valor <= 0) {
        throw new Error("El valor a consignar debe ser mayor a cero");
    }

    // Actualizar saldos
    cuentaOrigen.saldo -= datos.valor;
    cuentaDestinatario.saldo += datos.valor;

    // Registrar movimientos
    if (!movimientos[numeroCuentaActual]) {
        movimientos[numeroCuentaActual] = [];
    }
    movimientos[numeroCuentaActual].push({
        tipo: "Transferencia",
        valor: -datos.valor,
        referencia: generarReferencia(),
        descripcion: `Transferencia enviada a cuenta de ${cuentaDestinatario.nombre}`
    });

    if (!movimientos[numeroCuentaDestinatario]) {
        movimientos[numeroCuentaDestinatario] = [];
    }
    movimientos[numeroCuentaDestinatario].push({
        tipo: "Transferencia",
        valor: datos.valor,
        referencia: generarReferencia(),
        descripcion: `Transferencia recibida de ${cuentaOrigen.nombre}`
    });

    await Promise.all([
        guardarCuenta(numeroCuentaActual, cuentaOrigen),
        guardarCuenta(numeroCuentaDestinatario, cuentaDestinatario),
        guardarMovimientos(numeroCuentaActual, movimientos[numeroCuentaActual]),
        guardarMovimientos(numeroCuentaDestinatario, movimientos[numeroCuentaDestinatario])
    ]);

    mostrarModal('Éxito', `Transferencia exitosa. Su nuevo saldo es: $${cuentaOrigen.saldo.toLocaleString()}`);
}

// Retirar dinero de la cuenta logueada
export async function retirarDinero(cuenta, movimientos, numeroCuentaActual, valor) {
    if (valor > cuenta.saldo) {
        throw new Error("Fondos insuficientes");
    }
    
    if (valor <= 0) {
        throw new Error("El valor a retirar debe ser mayor a cero");
    }

    const nuevoSaldo = cuenta.saldo - valor;
    
    await guardarCuenta(numeroCuentaActual, {
        ...cuenta,
        saldo: nuevoSaldo
    });

    if (!movimientos[numeroCuentaActual]) {
        movimientos[numeroCuentaActual] = [];
    }
    
    movimientos[numeroCuentaActual].push({
        tipo: "Retiro",
        valor: valor,
        referencia: generarReferencia(),
        descripcion: "Retiro de cuenta"
    });

    await guardarMovimientos(numeroCuentaActual, movimientos[numeroCuentaActual]);
    
    mostrarModal('Éxito', `Retiro exitoso. Su nuevo saldo es: $${nuevoSaldo.toLocaleString()}`);
}

// Pagar servicios
export async function pagarServicios(cuenta, movimientos, numeroCuentaActual, datos) {
    const servicios = { 1: "Agua", 2: "Gas", 3: "Energía" };
    
    if (!servicios[datos.tipoServicio]) {
        throw new Error("Servicio no válido");
    }

    if (datos.valor > cuenta.saldo) {
        throw new Error("Fondos insuficientes para pagar el servicio");
    }
    
    if (datos.valor <= 0) {
        throw new Error("El valor del servicio debe ser mayor a cero");
    }

    const nuevoSaldo = cuenta.saldo - datos.valor;

    await guardarCuenta(numeroCuentaActual, {
        ...cuenta,
        saldo: nuevoSaldo
    });

    if (!movimientos[numeroCuentaActual]) {
        movimientos[numeroCuentaActual] = [];
    }

    movimientos[numeroCuentaActual].push({
        tipo: "Pago Servicio",
        valor: datos.valor,
        referencia: datos.referencia,
        descripcion: `Pago de servicio de ${servicios[datos.tipoServicio]}`
    });

    await guardarMovimientos(numeroCuentaActual, movimientos[numeroCuentaActual]);

    mostrarModal('Éxito', `Pago exitoso. Su nuevo saldo es: $${nuevoSaldo.toLocaleString()}`);
}