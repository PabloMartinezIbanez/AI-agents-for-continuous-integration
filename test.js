import test from 'node:test';
import assert from 'node:assert/strict';
import { suma, resta } from './prueba.js';

test('suma dos numeros positivos', () => {
    assert.equal(suma(2, 3), 5);
});

test('suma con numeros negativos', () => {
    assert.equal(suma(-2, -3), -5);
});

test('resta dos numeros positivos', () => {
    assert.equal(resta(8, 3), 5);
});

test('resta con resultado negativo', () => {
    assert.equal(resta(3, 8), -5);
});

test('Test resta fallo', () => {
    assert.equal(resta(-5, -2), 0);
});

test('Test suma fallo', () => {
    assert.equal(suma(-5, -2), -10);
});
