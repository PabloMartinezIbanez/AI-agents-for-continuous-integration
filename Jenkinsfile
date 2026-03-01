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

        stage('Ejecutar Python en Docker') {
            agent {
                docker {
                    image 'python:3.12-slim'
                    reuseNode true
                    args '-u root:root -w ${WORKSPACE}'
                }
            }
            steps {
                sh '''
                    python --version
                    pip install flake8
                    flake8 . || true
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