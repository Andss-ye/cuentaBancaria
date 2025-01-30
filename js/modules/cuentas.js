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
// Consultar movimientos de la cuenta
export function consultarMovimientos(numeroCuenta, movimientos) {
  const movimientosTable = document.getElementById('movimientosTable');
  const movimientosTableBody = document.getElementById('movimientosTableBody');
  const menuCliente = document.getElementById('menuCliente');
  
  // Limpiar tabla anterior
  movimientosTableBody.innerHTML = '';
  
  if (movimientos[numeroCuenta] && movimientos[numeroCuenta].length > 0) {
      movimientos[numeroCuenta].forEach(mov => {
          const row = document.createElement('tr');
          row.className = 'border-b hover:bg-gray-50';
          
          // Formatear el valor con signo y separadores de miles
          const valorFormateado = new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
          }).format(mov.valor);

          row.innerHTML = `
              <td class="px-4 py-2">${mov.tipo}</td>
              <td class="px-4 py-2 ${mov.valor < 0 ? 'text-red-600' : 'text-green-600'}">${valorFormateado}</td>
              <td class="px-4 py-2">${mov.referencia}</td>
              <td class="px-4 py-2">${mov.descripcion}</td>
          `;
          
          movimientosTableBody.appendChild(row);
      });
  } else {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td colspan="4" class="px-4 py-2 text-center text-gray-500">
              No hay movimientos en la cuenta
          </td>
      `;
      movimientosTableBody.appendChild(row);
  }
  
  menuCliente.classList.add('hidden');
  movimientosTable.classList.remove('hidden');
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
