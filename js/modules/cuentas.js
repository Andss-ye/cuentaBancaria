// Importar módulos
import { guardarCuenta, guardarMovimientos } from '../db.js';
import { validacionCuenta } from './validaciones.js';

// Crear una cuenta personalizada para cada usuario
export async function crearCuenta(nombre, documento, clave, cuentas, movimientos) {
    if (nombre === "") {
        throw new Error("El nombre no puede estar vacío");
    }

    if (documento <= 0) {
        throw new Error("El documento debe ser un número positivo");
    }

    // Validar si el documento ya existe
    const documentoExiste = Object.values(cuentas).some(cuenta => cuenta.documento === documento);
    if (documentoExiste) {
        throw new Error("El documento ya existe en el sistema");
    }

    const numeroCuenta = validacionCuenta(cuentas);
    await guardarCuenta(numeroCuenta, { documento, nombre, clave, saldo: 0 });
    await guardarMovimientos(numeroCuenta, []);
    return `\n===================== | Bienvenido ${nombre.toUpperCase()} | ===================== \n\nEl número de su cuenta es: ${numeroCuenta}\n`;
}

// Mostrar cuentas (para pruebas)
export function mostrarCuenta(cuentas) {
  console.log("\n\n=================== Mostrar Datos Cuenta ===================");
  console.log("CUENTA".padEnd(15) + "DOCUMENTO".padEnd(15) + "NOMBRE".padEnd(15) + "SALDO".padEnd(15));
  for (const [numeroCuenta, cuenta] of Object.entries(cuentas)) {
    console.log(
      `${numeroCuenta.padEnd(15)}${String(cuenta.documento).padEnd(15)}${cuenta.nombre.padEnd(15)}${String(cuenta.saldo).padEnd(15)}\n`
    );
  }
}

// Consultar movimientos de la cuenta
export function consultarMovimientos(numeroCuenta, movimientos) {
  console.log("\n\n=================== Extracto de movimientos ===================\n");
  console.log("Tipo de movimiento".padEnd(30) + "Valor".padEnd(15) + "Referencia".padEnd(15) + "Descripción".padEnd(40));
  if (movimientos[numeroCuenta]) {
    for (const mov of movimientos[numeroCuenta]) {
      console.log(
        `${mov.tipo.padEnd(30)}${String(mov.valor).padEnd(15)}${String(mov.referencia).padEnd(15)}${mov.descripcion.padEnd(40)}\n`
      );
    }
  } else {
    console.log("\nNo hay movimientos en la cuenta.");
  }
}

// Login de usuario
export function login(cuentas) {
  const numeroCuenta = prompt("Escriba su número de cuenta: ");
  const clave = prompt("Escriba su clave: ");
  const cuenta = cuentas[numeroCuenta]; // Verifica que la cuenta exista

  if (cuenta) {
    if (clave === cuenta.clave) {
      return numeroCuenta; // Retorna para obtener los datos del usuario
    }
    return null;
  }
  return null;
}
