# 📊 Exportador de Issues de SonarQube

Este conjunto de herramientas te permite exportar todos los issues detectados por SonarQube en un formato JSON estructurado, optimizado para ser enviado a cualquier IA (ChatGPT, Claude, etc.) para análisis y sugerencias de arreglo.

## 📁 Archivos Incluidos

### 1. **sonarqube-issues.json**
- JSON con todos los issues del proyecto
- Incluye: severidad, ubicación, descripción, sugerencias de arreglo
- Formato optimizado para IAs

### 2. **Library/export_sonarqube_issues.py**
- Script Python que genera el JSON automáticamente
- Se conecta a la API de SonarQube
- Extrae issues, hotspots de seguridad y métricas

### 3. **export-sonarqube.ps1** (Windows)
- Script PowerShell para ejecutar el exportador
- Interfaz amigable con colores

### 4. **export-sonarqube.sh** (Linux/Mac)
- Script Bash para ejecutar el exportador
- Compatible con CI/CD

## 🚀 Cómo Usar

### Windows (PowerShell)
```powershell
.\export-sonarqube.ps1
```

El JSON se guardará en `sonarqube-issues.json`

### Linux/Mac (Bash)
```bash
chmod +x export-sonarqube.sh
./export-sonarqube.sh
```

### Manualmente con Python
```bash
cd Library
python export_sonarqube_issues.py
```

## 📤 Enviar a una IA

### Opción 1: Copiar el JSON
1. Ejecuta el exportador
2. Abre `sonarqube-issues.json` con un editor de texto
3. Copia todo el contenido
4. Pégalo en tu IA favorita (ChatGPT, Claude, etc.)
5. Pide algo como: "Analiza estos issues de código y dame un plan detallado para arreglarllos"

### Opción 2: Subir el archivo
- Muchas IAs (Claude, ChatGPT Plus) aceptan archivos
- Puedes subir directamente `sonarqube-issues.json`

### Ejemplo de Prompt para IA
```
Tengo los siguientes issues de calidad de código detectados por SonarQube.
Por favor, analiza cada uno y proporciona:
1. Explicación del problema
2. Impacto potencial en el código
3. Paso a paso para arreglarlo
4. Ejemplo de código corregido
5. Cómo prevenir este problema en el futuro

Aquí están los issues:
[PEGAR JSON AQUÍ]
```

## 🔧 Configuración

Si necesitas cambiar la URL de SonarQube o el token, edita estos archivos:

**Library/export_sonarqube_issues.py** (variables al final):
```python
SONAR_URL = "http://tu-sonarqube:9000"
SONAR_TOKEN = "tu_token_aqui"
PROJECT_KEY = "tu-proyecto"
```

O pasa como argumentos:
```bash
python Library/export_sonarqube_issues.py http://tu-sonarqube:9000 tu_token tu-proyecto
```

## 📋 Estructura del JSON

El JSON generado contiene:
- **project**: Información del proyecto
- **summary**: Resumen de issues por severidad, estado y lenguaje
- **issues**: Array detallado de cada issue con:
  - ID único
  - Severidad
  - Archivo afectado
  - Línea del problema
  - Descripción
  - Tags
  - Sugerencia de arreglo
- **securityHotspots**: Puntos de seguridad potenciales

## 💡 Casos de Uso

- **Code Review**: Enviar a IA para análisis de calidad
- **Refactoring**: Obtener plan de mejora completo
- **Onboarding**: Enseñar a nuevos desarrolladores qué arreglar
- **Documentation**: Documentar deuda técnica
- **Automation**: Integrar en CI/CD para reportes automáticos

## 🔗 Integración con Jenkinsfile

Añade esta stage al Jenkinsfile para exportar automáticamente después del análisis:

```groovy
stage('Export Issues') {
    steps {
        script {
            sh '''
                python Library/export_sonarqube_issues.py
                echo "Issues exported to sonarqube-issues.json"
            '''
        }
    }
}
```

Luego puedes almacenarlos como artefacto del build.

---

**Nota**: El JSON está diseñado específicamente para ser entendible por IAs y contiene todas las sugerencias de arreglo pre-incluidas para facilitar el análisis.
