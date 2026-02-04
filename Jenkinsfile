pipeline {
    agent any
    
    environment {
        GEMINI_API_KEY = credentials('GEMINI_API_KEY')
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
                bash '''
                    python3 --version
                    python3 -m pip --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Instalando dependencias...'
                bash '''
                    python3 -m pip install --upgrade pip
                    python3 -m pip install flake8 pytest
                    python3 -m pip install -r requirements.txt
                '''
            }
        }

        stage('Get Code Changes') {
            steps {
                echo 'Obteniendo cambios del commit...'
                bash '''
                    git show --pretty=format:"" > diff.log
                '''
            }
}

        stage('Lint') {
            steps {
                echo 'Ejecutando lint con flake8...'
                // stop the build if there are Python syntax errors or undefined names
                // exit-zero treats all errors as warnings. The GitHub editor is 127 chars wide
                bash '''
                    python3 -m flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
                    python3 -m flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics > lint.log || exit 0
                '''
            }
        }

        stage('Unit Tests') {
            steps {
                echo 'Ejecutando tests con pytest...'
                bash '''
                    python3 -m pytest test.py > tests.log || exit 0
                '''
            }
        }

        stage('AI Analysis') {
            steps {
                echo 'Analizando resultados con IA...'
                bash '''
                    python3 ia_analyzer.py
                '''
            }
        }
        
        stage('Build Executable') {
            steps {
                echo 'Construyendo ejecutable con PyInstaller...'
                bash '''
                    python3 -m PyInstaller --onefile --name suma suma.py
                '''
            }
        }
        
        stage('List Artifacts') {
            steps {
                echo 'Archivos generados:'
                bash 'ls dist'
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                echo 'Archivando ejecutable...'
                archiveArtifacts artifacts: 'dist/*.exe', fingerprint: true

                echo 'Archivando logs...'
                archiveArtifacts artifacts: '*.log', fingerprint: true

                echo 'Archivando informe IA...'
                archiveArtifacts artifacts: 'ai_report.md', fingerprint: true
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