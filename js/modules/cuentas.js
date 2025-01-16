// Importar módulos
import { validacionCuenta, validacionDocumento } from './validaciones.js';

// Crear una cuenta personalizada para cada usuario
export function crearCuenta(cuentas, movimientos) {
  let name;
  while (true) {
    name = prompt("Ingrese su nombre: ");
    if (name === "") { // Verifica si el nombre está vacio
        console.log("El nombre no puede ser vacio. Intente nuevamente.");
    } else {
        console.log(`Bienvenido ${name.toUpperCase()}`);
        break;
    }
  }

  let document;
  while (true) {
    document = validacionDocumento(cuentas);
    if (document > 0) {
      break;
    } else {
      console.log("El documento debe ser un número positivo. Intente nuevamente.");
    }
  }

  const clave = prompt("Digite la clave que quiere para su cuenta: ");
  const numeroCuenta = validacionCuenta(cuentas); // Generar el número de cuenta
  cuentas[numeroCuenta] = { documento: document, nombre: name, clave: clave, saldo: 0 };
  movimientos[numeroCuenta] = []; // Inicializa los movimientos con un array vacío
  return `\n===================== | Bienvenido ${name.toUpperCase()} | ===================== \n\nEl número de su cuenta es: ${numeroCuenta}\n`;
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
