pipeline {
    agent any
    
    environment {
        GEMINI_API_KEY = credentials('GEMINI_API_KEY')
    }

    triggers {
        githubPush()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Obteniendo código del repositorio...'
                checkout scm
            }
        }
        
        stage('Setup node') {
            steps {
                echo 'Verificando instalación de Node...'
                sh '''
                    node --version
                    npm --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Instalando dependencias...'
                sh '''
                    npm ci
                '''
            }
        }

        stage('Get Code Changes') {
            steps {
                echo 'Obteniendo cambios del commit...'
                script {
                    def base = env.CHANGE_TARGET ?: 'main'
                    sh "git fetch origin ${base} --quiet"
                    sh "git diff --unified=0 origin/${base}...HEAD > diff.txt"
                }
            }
}

        stage('Lint') {
            steps {
                echo 'Ejecutando lint con flake8...'
                // stop the build if there are Python syntax errors or undefined names
                // exit-zero treats all errors as warnings. The GitHub editor is 127 chars wide
                sh '''
                    npm run lint > lint.txt
                '''
            }
        }

        stage('Unit Tests') {
            steps {
                echo 'Ejecutando tests con pytest...'
                sh '''
                    npm run test > tests.txt
                '''
            }
        }

        stage('AI Analysis') {
            steps {
                echo 'Analizando resultados con IA...'
                sh '''
                    node ia_analyzer.js
                '''
            }
        }
        
        stage('List Artifacts') {
            steps {
                echo 'Archivos generados:'
                sh 'ls -la'
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                echo 'Archivando logs...'
                archiveArtifacts artifacts: '*.txt', fingerprint: true

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