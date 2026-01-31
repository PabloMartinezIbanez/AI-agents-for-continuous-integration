pipeline {
    agent {
        label 'windows'
    }
    
    environment {
        PYTHON_VERSION = '3.11'
    }
    
    stages {
        stage('hello') {
            steps {
                echo 'Hello world'
            }
        }
    }
}