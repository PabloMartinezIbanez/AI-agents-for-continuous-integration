pipeline {
    agent any

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

        stage('Ejecutar Python en contenedor Docker') {
            agent {
                docker {
                    image 'python:3.12-slim'
                    reuseNode true             // ← Comparte el workspace con el nodo principal
                    args '-u root:root'        // Evita problemas de permisos
                }
            }
            steps {
                sh '''
                    python --version
                    pip install flake8
                    flake8 . || true   # O tu comando real de lint
                '''
            }
        }
    }
    post {
        success {
            echo 'Build completado exitosamente!'
            echo 'Los archivos creados se encuentran en los artefactos'
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