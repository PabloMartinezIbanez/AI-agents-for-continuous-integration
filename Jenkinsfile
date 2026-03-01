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
        
        stage('Setup Enviroments'){
            parallel {
                stage('Setup node') {
                    steps {
                        sh '''
                            node --version
                            npm --version
                            npm config set cache /tmp/npm-cache --global
                            npm init -y --quiet > /dev/null 2>&1 || true

                            # Instalar ESLint + TODOS los paquetes que importas en eslint.config.mjs
                            npm install --save-dev \
                            eslint@10 \
                            @eslint/js \
                            globals \
                            @eslint/json \
                            --quiet --no-fund --no-audit > /dev/null 2>&1 || true
                        '''
                    }
                }

                stage('Setup Python') {
                    steps {
                        sh '''
                            python --version
                            pip install flake8 --quiet
                            pip install pytest --quiet
                        '''
                    }
                }
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
                }
            }
        
        }

        stage('Lint archivos modificados') {
            steps {
                script {
                    def lintFile = 'lint.txt'
                    // Vaciar lint.txt si existe
                    sh "echo '' > ${lintFile}"

                    // Obtener lista de archivos modificados (adaptado al contexto)
                    def modifiedFiles
                    if (env.CHANGE_ID) {
                        // PR: todos los archivos cambiados en el PR
                        modifiedFiles = sh(script: "git diff --name-only origin/${env.CHANGE_TARGET ?: 'main'}...HEAD", returnStdout: true).trim().split('\n')
                    } else {
                        // Push/manual: archivos del último commit
                        modifiedFiles = sh(script: "git diff --name-only HEAD~1...HEAD", returnStdout: true).trim().split('\n')
                    }

                    echo "Archivos modificados detectados: ${modifiedFiles}"

                    // Para cada archivo, detectar lenguaje por extension y lint
                    modifiedFiles.each { file ->
                        if (file.trim()) {  // Ignorar vacíos
                            def ext = file.split('\\.')[-1]?.toLowerCase()  // Extensión (e.g., 'py')
                            echo "Procesando archivo: ${file} (ext: ${ext})"

                            switch (ext) {
                                case 'py':
                                    // Linter para Python: flake8 (asumiendo instalado via pip o global)
                                    sh """
                                        echo "Lint de ${file} (flake8):" >> ${lintFile}
                                        python -m flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 >> ${lintFile} 2>&1 || true  # Continúa si falla
                                        echo "" >> ${lintFile}  # Separador
                                    """
                                    break
                                case 'js':
                                    // Linter para JS: eslint (asumiendo instalado via npm global o local)
                                    sh """
                                        export LANG=C.UTF-8
                                        export LC_ALL=C.UTF-8
                                        echo "Lint de ${file} (eslint):" >> ${lintFile}
                                        eslint --config "${WORKSPACE}/Library/eslint.config.mjs" '${file}' >> ${lintFile} 2>&1 || true
                                        echo "" >> ${lintFile}
                                    """
                                    break
                                // Añade más linters aquí, e.g.:
                                // case 'rb':  // Ruby con rubocop
                                //     sh "rubocop '${file}' >> ${lintFile} 2>&1 || true"
                                // case 'java':  // Java con checkstyle
                                //     sh "checkstyle -c /path/to/config.xml '${file}' >> ${lintFile} 2>&1 || true"
                                default:
                                    echo "No linter configurado para extensión '${ext}' en ${file}. Saltando."
                            }
                        }
                    }
                }
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
                    echo 'No AI analysis performed' > ai_report.md
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