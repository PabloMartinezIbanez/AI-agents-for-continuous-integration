pipeline {
    agent any

    tools {
        nodejs '25.6.1'
    }

    environment {
        GEMINI_API_KEY = credentials('GEMINI_API_KEY')
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Obteniendo código del repositorio...'
                checkout scm
            }
        }
        
        stage('Setup node') {
            steps {
                echo 'Verificando instalación de Node y Python...'
                sh '''
                    node --version
                    npm --version
                '''
            }
        }


        stage('Installing dependencies') {
            steps {
                echo 'Instalando dependencias...'
                    sh '''
                        python --version
                        pip install flake8 --quiet
                        pip install pytest --quiet
                    '''
            }
        }

        stage('Obtener diff de cambios') {
            steps {
                script {
                    // Variables comunes
                    def diffFile = 'diff.txt'
                    def baseBranch = env.CHANGE_TARGET ?: env.BRANCH_NAME ?: 'main'  // Fallback a rama actual o 'main'

                    // Fetch general de origin para asegurar refs actualizadas
                    sh "git fetch origin --quiet --no-tags"

                    // Caso 1: Si es un PR (detectado por CHANGE_ID)
                    if (env.CHANGE_ID) {
                        echo "Detectado PR #${env.CHANGE_ID}. Obteniendo diff acumulado desde base ${baseBranch}."
                        
                        // Fetch específico para rama base y PR head
                        sh """
                            git fetch origin \
                                +refs/heads/${baseBranch}:refs/remotes/origin/${baseBranch} \
                                +refs/pull/${env.CHANGE_ID}/head:refs/remotes/origin/PR-${env.CHANGE_ID} \
                                --quiet
                        """
                        
                        // Diff acumulado del PR entero
                        sh "git diff --unified=0 origin/${baseBranch}...HEAD > ${diffFile}"
                    } 
                    // Caso 2 & 3: Push directo o manual (no PR)
                    else {
                        echo "No es PR (push o manual). Obteniendo diff del último commit en rama ${baseBranch}."
                        
                        // Fetch de la rama actual
                        sh "git fetch origin ${baseBranch}:origin/${baseBranch} --quiet"
                        
                        // Diff del último commit (HEAD~1...HEAD). Si quieres más commits, ajusta a un ancestro conocido
                        sh "git diff --unified=0 HEAD~1...HEAD > ${diffFile}"
                        
                        // Alternativa: si quieres diff acumulado desde origin/main (por si la rama está divergiendo)
                        // sh "git diff --unified=0 origin/main...HEAD > ${diffFile}"
                    }

                    // Verificación común: asegúrate de que diff.txt existe y tiene contenido
                    sh "ls -l ${diffFile}"
                    sh "head -n 20 ${diffFile} || echo 'Diff vacío o no generado'"

                    // Aquí puedes pasar diff.txt a la IA (e.g., leerlo y enviarlo a LLM)
                    def diffContent = readFile(diffFile)
                    echo "Contenido de diff.txt listo para IA: ${diffContent.take(500)}..."  // Preview corto
                }
            }
        
        }

        stage('Lint') {
            steps {
                echo 'Ejecutando lint con flake8...'
                // stop the build if there are Python syntax errors or undefined names
                // exit-zero treats all errors as warnings. The GitHub editor is 127 chars wide
                sh '''
                    python -m flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics > lint.log || exit 0
                '''
            }
        }

        stage('Unit Tests') {
            steps {
                echo 'Ejecutando tests con pytest...'
                sh '''
                    python -m pytest test.py > tests.txt || exit 0
                '''
            }
        }

        stage('AI Analysis') {
            steps {
                echo 'Analizando resultados con IA...'
                sh '''
                    #node ia_analyzer.js || true
                '''
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                echo 'Archivando logs...'
                archiveArtifacts artifacts: '*.txt', fingerprint: true

                echo 'Archivando informe IA...'
                archiveArtifacts artifacts: 'ai_report.md', fingerprint: true
            }
        }
    }
    
    post {
        success {
            echo 'Build completado exitosamente!'
            echo 'El ejecutable suma.exe está disponible en los artefactos'
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