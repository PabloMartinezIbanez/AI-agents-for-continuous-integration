pipeline {
    agent any

    environment {
        DOCKER_HOST = 'tcp://host.docker.internal:2375'
    }

    triggers {
        githubPush()
    }

    tools {
        dockerTool 'Docker-v27.3.1'   // ← Usa la versión que configuraste
    }

    stages {
        stage('Test Docker') {
            steps {
                sh 'docker --version'   // Debería mostrar la versión
                sh 'docker run --rm hello-world'   // Prueba simple
            }
        }

        stage('Ejecutar Python') {
            steps {
                script {
                    docker.withServer('tcp://host.docker.internal:2375') {  // si usas TCP en Windows
                        docker.image('python:3.12-slim').inside('-u root -w /workspace') {
                            sh 'python --version'
                            sh 'pip install flake8'
                            sh 'flake8 . || true'
                        }
                    }
                }
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