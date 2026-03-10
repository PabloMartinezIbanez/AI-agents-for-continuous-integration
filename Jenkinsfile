pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {
        stage('Scan') {
            steps {
                withSonarQubeEnv(installationName: 'sonarQube_server') {
                    sh './mvnw clean org. sonarsource. scanner.maven: sonar-maven-plugin:3.9.0.2155:sonar'
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