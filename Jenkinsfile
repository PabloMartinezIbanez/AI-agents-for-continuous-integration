pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {

        stage('Scan') {
            environment{
                SONAR_TOKEN = credentials('SonarQube webhook')
            }
            steps {
                withSonarQubeEnv(installationName: 'SonarQube webhook') {
                    sh './gradlew sonar'
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