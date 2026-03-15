import { suma, resta } from './prueba.js';

// Tests for the sum function
console.log('=== Tests for sum function ===');
console.log('suma(2, 3) === 5:', suma(2, 3) === 5 ? 'PASS' : 'FAIL');
console.log('suma(-2, -3) === -5:', suma(-2, -3) === -5 ? 'PASS' : 'FAIL');
console.log('suma(5, -3) === 2:', suma(5, -3) === 2 ? 'PASS' : 'FAIL');
console.log('suma(0, 5) === 5:', suma(0, 5) === 5 ? 'PASS' : 'FAIL');
console.log('suma(0, 0) === 0:', suma(0, 0) === 0 ? 'PASS' : 'FAIL');
console.log('suma(2.5, 3.5) === 6:', suma(2.5, 3.5) === 6 ? 'PASS' : 'FAIL');

// Tests for the subtraction function
console.log('\n=== Tests for subtraction function ===');
console.log('resta(5, 3) === 2:', resta(5, 3) === 2 ? 'PASS' : 'FAIL');
console.log('resta(-2, -3) === 1:', resta(-2, -3) === 1 ? 'PASS' : 'FAIL');
console.log('resta(5, -3) === 8:', resta(5, -3) === 8 ? 'PASS' : 'FAIL');
console.log('resta(0, 5) === -5:', resta(0, 5) === -5 ? 'PASS' : 'FAIL');
console.log('resta(5, 0) === 5:', resta(5, 0) === 5 ? 'PASS' : 'FAIL');
console.log('resta(0, 0) === 0:', resta(0, 0) === 0 ? 'PASS' : 'FAIL');
console.log('resta(5.5, 2.5) === 3:', resta(5.5, 2.5) === 3 ? 'PASS' : 'FAIL');

console.log('\n=== End of tests ===');