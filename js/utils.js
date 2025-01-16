// Generar números de cuenta
export function generarNumeroCuenta() {
    const numero = Math.floor(Math.random() * (999 - 10 + 1)) + 10; // Genera un número entre 10 y 999
    return numero.toString().padStart(3, '0'); // Rellena con ceros a la izquierda
}

// Generar referencias
export function generarReferencia() {
    const numero = Math.floor(Math.random() * (99999 - 1 + 1)) + 1; // Genera un número entre 1 y 99999
    return numero.toString().padStart(5, '0'); // Rellena con ceros a la izquierda
}