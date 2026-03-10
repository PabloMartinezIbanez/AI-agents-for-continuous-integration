pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {
        stage('Scan') {
            steps {
                withSonarQubeEnv(installationName: 'sonarQube_server') {
                    withMaven(
                        maven: 'Maven_v3.9.13',
                    ) {
                        sh 'mvn clean sonar:sonar'
                    }
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