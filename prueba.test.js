import { describe, it, expect } from 'vitest';
import { suma, resta } from './prueba.js';

describe('Funciones matemáticas básicas', () => {
    describe('suma', () => {
        it('debe sumar dos números positivos correctamente', () => {
            expect(suma(2, 3)).toBe(5);
        });

        it('debe sumar dos números negativos correctamente', () => {
            expect(suma(-2, -3)).toBe(-5);
        });

        it('debe sumar un número positivo y otro negativo', () => {
            expect(suma(5, -3)).toBe(2);
        });

        it('debe sumar cero con otro número', () => {
            expect(suma(0, 5)).toBe(5);
        });

        it('debe sumar dos ceros', () => {
            expect(suma(0, 0)).toBe(0);
        });

        it('debe sumar números decimales', () => {
            expect(suma(2.5, 3.5)).toBe(6);
        });
    });

    describe('resta', () => {
        it('debe restar dos números positivos correctamente', () => {
            expect(resta(5, 3)).toBe(2);
        });

        it('debe restar dos números negativos correctamente', () => {
            expect(resta(-2, -3)).toBe(1);
        });

        it('debe restar un número negativo de uno positivo', () => {
            expect(resta(5, -3)).toBe(8);
        });

        it('debe restar un número positivo de cero', () => {
            expect(resta(0, 5)).toBe(-5);
        });

        it('debe restar cero de un número', () => {
            expect(resta(5, 0)).toBe(5);
        });

        it('debe restar dos ceros', () => {
            expect(resta(0, 0)).toBe(0);
        });

        it('debe restar números decimales', () => {
            expect(resta(5.5, 2.5)).toBe(3);
        });
    });
});
