import { suma, resta } from './prueba.js';
import fs from 'fs';

let failures = [];

function check(testName, condition, expected, actual) {
    if (!condition) {
        failures.push({
            test: testName,
            expected: expected,
            actual: actual
        });
    }
}

// Tests for the sum function
check('suma(2, 3)', suma(2, 3) === 5, 5, suma(2, 3));
check('suma(-2, -3)', suma(-2, -3) === -5, -5, suma(-2, -3));
check('suma(5, -3)', suma(5, -3) === 2, 2, suma(5, -3));
check('suma(0, 5)', suma(0, 5) === 5, 5, suma(0, 5));
check('suma(0, 0)', suma(0, 0) === 0, 0, suma(0, 0));
check('suma(2.5, 3.5)', suma(2.5, 3.5) === 6, 6, suma(2.5, 3.5));

// Tests for the subtraction function
check('resta(5, 3)', resta(5, 3) === 2, 2, resta(5, 3));
check('resta(-2, -3)', resta(-2, -3) === 1, 1, resta(-2, -3));
check('resta(5, -3)', resta(5, -3) === 8, 8, resta(5, -3));
check('resta(0, 5)', resta(0, 5) === -5, -5, resta(0, 5));
check('resta(5, 0)', resta(5, 0) === 5, 5, resta(5, 0));
check('resta(0, 0)', resta(0, 0) === 0, 0, resta(0, 0));
check('resta(5.5, 2.5)', resta(5.5, 2.5) === 3, 3, resta(5.5, 2.5));

//Test with a failure
check('suma(2, 2)', suma(2, 2) === 5, 5, suma(2, 2));
check('resta(2, 2)', resta(2, 2) === 5, 5, resta(2, 2));

// Write JSON with failures
fs.writeFileSync('assets/js_test_results.json', JSON.stringify({ failures }, null, 2));