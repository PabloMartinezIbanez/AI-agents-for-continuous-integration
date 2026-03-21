import { createInterface } from 'node:readline/promises';
import process from 'node:process';

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

    const num1 = Number(await rl.question("Introduce el primer número: "));
    const num2 = Number(await rl.question("Introduce el segundo número: "));

    console.log("Resultado de la suma:", suma(num1, num2));
    console.log("Resultado de la resta:", resta(num1, num2));

    rl.close();
}