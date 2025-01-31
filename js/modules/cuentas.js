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

// Consultar movimientos de la cuenta
export function consultarMovimientos(numeroCuenta, movimientos) {
  const movimientosTable = document.getElementById('movimientosTable');
  const movimientosTableBody = document.getElementById('movimientosTableBody');
  const menuCliente = document.getElementById('menuCliente');
  
  movimientosTableBody.innerHTML = '';
  
  if (movimientos[numeroCuenta] && movimientos[numeroCuenta].length > 0) {
      movimientos[numeroCuenta].forEach(mov => {
          const row = document.createElement('tr');
          row.className = 'border-b hover:bg-gray-50';

          row.innerHTML = `
              <td class="px-4 py-2">${mov.tipo}</td>
              <td class="px-4 py-2 ${mov.valor < 0 ? 'text-red-600' : 'text-green-600'}">${mov.valor}</td>
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