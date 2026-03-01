pipeline {
    agent any

    triggers {
        githubPush()
    }

    tools {
        dockerTool 'Docker-v27.3.1'   // ← Usa la versión que configuraste
    }

    stages {
        stage('Usar Docker') {
            steps {
                sh 'docker --version'   // Debería mostrar 27.3.1
                sh 'docker run --rm hello-world'   // Prueba simple
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