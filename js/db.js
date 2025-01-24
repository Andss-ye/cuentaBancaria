const DB_NAME = 'bancoDB';
const DB_VERSION = 1;

// Inicializar la base de datos
export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Crear almacén para cuentas
            if (!db.objectStoreNames.contains('cuentas')) {
                db.createObjectStore('cuentas', { keyPath: 'numeroCuenta' });
            }

            // Crear almacén para movimientos
            if (!db.objectStoreNames.contains('movimientos')) {
                db.createObjectStore('movimientos', { keyPath: 'numeroCuenta' });
            }
        };
    });
}

// Funciones para manipular cuentas
export async function guardarCuenta(numeroCuenta, dataCuenta) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['cuentas'], 'readwrite');
        const store = transaction.objectStore('cuentas');
        const request = store.put({
            numeroCuenta,
            ...dataCuenta
        });

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function obtenerCuentas() {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['cuentas'], 'readonly');
        const store = transaction.objectStore('cuentas');
        const request = store.getAll();

        request.onsuccess = () => {
            const cuentas = {};
            request.result.forEach(cuenta => {
                const { numeroCuenta, ...resto } = cuenta;
                cuentas[numeroCuenta] = resto;
            });
            resolve(cuentas);
        };
        request.onerror = () => reject(request.error);
    });
}

// Funciones para manipular movimientos
export async function guardarMovimientos(numeroCuenta, movimientos) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['movimientos'], 'readwrite');
        const store = transaction.objectStore('movimientos');
        const request = store.put({
            numeroCuenta,
            movimientos
        });

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function obtenerMovimientos() {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['movimientos'], 'readonly');
        const store = transaction.objectStore('movimientos');
        const request = store.getAll();

        request.onsuccess = () => {
            const movimientos = {};
            request.result.forEach(item => {
                movimientos[item.numeroCuenta] = item.movimientos;
            });
            resolve(movimientos);
        };
        request.onerror = () => reject(request.error);
    });
} 