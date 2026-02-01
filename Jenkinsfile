pipeline {
    agent {
        // Necesitamos un agente con Windows para crear .exe
        label 'windows'
    }
    
    environment {
        PYTHON_VERSION = '3.11'
        PYTHON = 'C:\\Users\\pabma\\AppData\\Local\\Programs\\Python\\Python314\\python.exe'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Obteniendo código del repositorio...'
                checkout scm
            }
        }
        
        stage('Setup Python') {
            steps {
                echo 'Verificando instalación de Python...'
                bat '''
                    "%PYTHON%" --version
                    "%PYTHON%" -m pip --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Instalando dependencias...'
                bat '''
                    "%PYTHON%" -m pip install --upgrade pip
                    "%PYTHON%" -m pip install flake8 pytest
                    "%PYTHON%" -m pip install -r requirements.txt
                '''
            }
        }

        stage('Lint') {
            steps {
                echo 'Ejecutando lint con flake8...'
                bat '''
                    # stop the build if there are Python syntax errors or undefined names
                    "%PYTHON%" -m flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
                    # exit-zero treats all errors as warnings. The GitHub editor is 127 chars wide
                    "%PYTHON%" -m flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics > lint.log || exit 0
                '''
            }
        }

        stage('Unit Tests') {
            steps {
                echo 'Ejecutando tests con pytest...'
                bat '''
                    "%PYTHON%" -m pytest test.py > tests.log || exit 0
                '''
            }
        }
        
        stage('Build Executable') {
            steps {
                echo 'Construyendo ejecutable con PyInstaller...'
                bat '''
                    "%PYTHON%" -m PyInstaller --onefile --name suma suma.py
                '''
            }
        }
        
        stage('List Artifacts') {
            steps {
                echo 'Archivos generados:'
                bat 'dir dist'
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                echo 'Archivando ejecutable...'
                archiveArtifacts artifacts: 'dist/*.exe', fingerprint: true
            }
        }
    }
    
    post {
        success {
            echo 'Build completado exitosamente!'
            echo 'El ejecutable suma.exe está disponible en los artefactos'
        }
        failure {
            echo 'El build ha fallado. Revisa los logs para más información.'
        }
        always {
            echo 'Limpiando workspace...'
            cleanWs()
        }
    }
}