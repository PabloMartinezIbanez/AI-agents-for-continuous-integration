pipeline {
    agent any

    triggers {
        githubPush()
    }

    tools {
        maven 'Maven_v3.9.13'
    }

    stages {
        stage('Build'){
            steps{
                sh 'mvn compie'
            }
        }
        stage('Test'){
            steps{
                sh 'mvn test'
            }
        }
        stage('Scan') {
            environment{
                SONAR_TOKEN = credentials('SonarQube webhook')
            }
            steps {
                withSonarQubeEnv(installationName: 'SonarQube webhook') {
                    sh 'mvn sonar:sonar -Dsonar.projectKey=linter -Dsonar.host.url=http://localhost:9000 -Dsonar.token=${SONAR_TOKEN} -Dsonar.verbose=true'
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