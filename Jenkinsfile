pipeline {
    agent {
        label 'windows'
    }
    
    environment {
        PYTHON = 'C:\\Users\\pabma\\AppData\\Local\\Programs\\Python\\Python314\\python.exe'
        GEMINI_API_KEY = credentials('GEMINI_API_KEY')
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Obteniendo código del repositorio...'
                checkout scm
            }
        }

        stage('testing curl instalation'){
            steps {
                echo 'Testing curl instalation...'
                bat '''
                    curl --version
                '''
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

        stage('Get Code Changes') {
            steps {
                echo 'Obteniendo cambios del commit...'
                bat '''
                    git show --pretty=format:"" > diff.log
                '''
            }
}

        stage('Lint') {
            steps {
                echo 'Ejecutando lint con flake8...'
                // stop the build if there are Python syntax errors or undefined names
                // exit-zero treats all errors as warnings. The GitHub editor is 127 chars wide
                bat '''
                    "%PYTHON%" -m flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
                    "%PYTHON%" -m flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 > lint.log || exit 0
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

        stage('AI Analysis with n8n') {
            steps {
                echo 'Mandando los logs a n8n'
                bat '''
                    curl -X POST http://localhost:5000/webhook-test/Jenkins-pipeline ^
                        -F lint=@lint.log ^
                        -F tests=@tests.log ^
                        -F diff=@diff.log ^
                        -F commit=%GIT_COMMIT% ^
                        -F branch=%BRANCH_NAME%
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