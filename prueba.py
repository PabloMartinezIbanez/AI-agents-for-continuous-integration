#!/usr/bin/env python3
"""
Script simple que suma dos números
"""

def main():
    print("=== Calculadora de Suma ===")
    
    try:
        numero1 = float(input("Ingresa el primer número: "))
        numero2 = float(input("Ingresa el segundo número: "))
        
        resultado = numero1 + numero2
        
        print(f"\nResultado: {numero1} + {numero2} = {resultado}")
        
        input("\nPresiona Enter para salir...")
        
    except ValueError:
        print("Error: Por favor ingresa números válidos")
        input("\nPresiona Enter para salir...")
    except Exception as e:
        print(f"Error inesperado: {e}")
        input("\nPresiona Enter para salir...")

if __name__ == "__main__":
    main()