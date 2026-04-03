#!/usr/bin/env python3

"""
Script simple que suma dos números
"""

def main():
    print("=== Calculadora de Suma ===")
    
    EXIT_PROMPT = "\nPresiona Enter para salir..."
    
    try:
        numero1 = float(input("Ingresa el primer número: "))
        numero2 = float(input("Ingresa el segundo número: "))
        
        resultado = suma(numero1, numero2)
        
        print(f"\nResultado: {numero1} + {numero2} = {resultado}")
        
        input(EXIT_PROMPT)
        
    except ValueError:
        print("Error: Por favor ingresa números válidos")
        input(EXIT_PROMPT)
    except Exception as e:
        print(f"Error inesperado: {e}")
        input(EXIT_PROMPT)

def suma(a, b):
    return a + b

def resta(a, b):
    return a - b

if __name__ == "__main__":
    main()
