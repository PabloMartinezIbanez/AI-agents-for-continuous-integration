pipeline {
    agent {
        // Necesitamos un agente con Windows para crear .exe
        label 'windows'
    }
    
    environment {
        PYTHON_VERSION = '3.11'
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
                    python --version
                    python -m pip --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Instalando dependencias...'
                bat '''
                    python -m pip install --upgrade pip
                    pip install -r requirements.txt
                '''
            }
        }
        
        stage('Build Executable') {
            steps {
                echo 'Construyendo ejecutable con PyInstaller...'
                bat '''
                    pyinstaller --onefile --name suma suma.py
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