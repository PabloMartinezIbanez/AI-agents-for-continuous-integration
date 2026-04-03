@Library('AI_agents_for_CI_shared_library') _

pipeline {
    agent none
    
    environment {
        GEMINI_API_KEY = credentials('GEMINI_API_KEY')
    }

    stages {
        stage('Agent') {
            agent {
                docker { 
                    image 'python:3.11-slim'
                    // Opcional: evitar pull si ya está local
                    alwaysPull false 
                }
            }
            steps {
                echo 'Agent set up successfully'
                sh 'python --version'
                sh 'python -m pip --version'
            }
        }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup Python') {
            steps {
                echo 'Verificando instalación de Python...'
                sh '''
                    python --version
                    python -m pip --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Instalando dependencias...'
                sh '''
                    python -m pip install --upgrade pip
                    python -m pip install flake8 pytest
                    python -m pip install -r requirements.txt
                '''
            }
        }

        stage('Prepare AI Directory') {
            steps {
                echo 'Obteniendo cambios del commit...'
                sh '''
                    git show --pretty=format:"" > diff.log
                '''
            }
        }

        stage('Scan') {
            steps {
                echo 'Ejecutando lint con flake8...'
                // stop the build if there are Python syntax errors or undefined names
                // exit-zero treats all errors as warnings. The GitHub editor is 127 chars wide
                sh '''
                    python -m flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
                    python -m flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics > lint.log || exit 0
                '''
            }
        }
        stage("Quality Gate") {
            steps {
                echo 'Ejecutando tests con pytest...'
                sh '''
                    python -m pytest test.py > tests.log || exit 0
                '''
            }
        }

        stage('AI Analysis') {
            steps {
                echo 'Analizando resultados con IA...'
                sh '''
                    python ia_analyzer.py
                '''
            }
            steps {
                echo 'Construyendo ejecutable con PyInstaller...'
                sh '''
                    python -m PyInstaller --onefile --name suma suma.py
                '''
            }
        }
        
        stage('List Artifacts') {
            steps {
                echo 'Archivos generados:'
                sh 'ls dist'
            }
            steps {
                script {
                    def failedSuites = []

                    int pythonStatus = sh(
                        script: "PYTHONPATH=\"$WORKSPACE/src/calculator\" python3 -m pytest \"$WORKSPACE/tests/python/test_suma.py\" --json-report --json-report-file=\"$WORKSPACE/$AI_REPORTS_DIR/python_test_results.json\" > /dev/null 2>&1",
                        returnStatus: true
                    )
                    if (pythonStatus != 0) {
                        failedSuites << 'python'
                    }

                    int jsStatus = sh(
                        script: "node --test --test-reporter=junit --test-reporter-destination=\"$WORKSPACE/$AI_REPORTS_DIR/js_test_results.xml\" tests/javascript/test_prueba.js > /dev/null 2>&1",
                        returnStatus: true
                    )
                    if (jsStatus != 0) {
                        failedSuites << 'javascript'
                    }

                    archiveArtifacts artifacts: "${env.AI_REPORTS_DIR}/*", fingerprint: true, allowEmptyArchive: true

                    if (failedSuites) {
                        error("Test suites failed: ${failedSuites.join(', ')}")
                    }
                }
            }
        }

        stage('Fix Issues with AI') {
            when {
                expression { env.CHANGE_ID && !((env.CHANGE_BRANCH ?: '').startsWith('ai-fix/')) }
            }
            steps {
                echo "Attempting to fix issues with AI..."
                FixWithAI(
                    llmModel: 'gemini-3.1-pro-preview', // 'gemini-3-flash-preview',
                    llmCredentialId: 'LLM_API_KEY_VALUE',
                    githubCredentialId: 'Github_AI_Auth',
                    repoSlug: 'PabloMartinezIbanez/AI-agents-for-continuous-integration',
                    testConfigFile: 'ai-tests-config.json',
                    dryRun: false
                )
            }
        }
    }
    post {
        always {
            cleanWs(
                cleanWhenSuccess: true,
                cleanWhenFailure: false,
                deleteDirs: true
            )
        }
    }
}
