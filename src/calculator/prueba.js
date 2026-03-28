import { createInterface } from 'node:readline';

export function suma(a, b) {
    return a + b;

}

export function resta(a, b) {
    return a - b;
}

// Función main solo se ejecuta si este archivo es el principal
if (import.meta.url === `file://${process.argv[1]}`) {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const preguntar = (texto) => {
        return new Promise((resolve) => {
            rl.question(texto, (respuesta) => {
                resolve(Number(respuesta));
            });
        });
    };

    const num1 = await preguntar("Introduce el primer número: ");
    const num2 = await preguntar("Introduce el segundo número: ");

    console.log("Resultado de la suma:", suma(num1, num2));
    console.log("Resultado de la resta:", resta(num1, num2));

    rl.close();
}

