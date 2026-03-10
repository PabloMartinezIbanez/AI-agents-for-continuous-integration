pipeline {
    agent any

    triggers {
        githubPush()
    }

    tools {
        maven 'Maven_v3.9.13'
    }

    stages {
        stage('Scan') {
            steps {
                withSonarQubeEnv(installationName: 'sonarQube_server') {
                    sh 'mvn clean verify sonar:sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=squ_580f62a18e008f6e984a2c136c2b983d0cd305c3x -Dsonar.verbose=true'
                }
            }
        }
        stage("Quality Gate") {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}