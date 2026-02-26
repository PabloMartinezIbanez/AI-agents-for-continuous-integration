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
                    npm install -g eslint
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

                    // Para cada archivo, detectar lenguaje por extensión y lint
                    modifiedFiles.each { file ->
                        if (file.trim()) {  // Ignorar vacíos
                            def ext = file.split('\\.')[-1]?.toLowerCase()  // Extensión (e.g., 'py')
                            echo "Procesando archivo: ${file} (ext: ${ext})"

                            switch (ext) {
                                case 'py':
                                    // Linter para Python: flake8 (asumiendo instalado via pip o global)
                                    sh """
                                        echo "Lint de ${file} (flake8):" >> ${lintFile}
                                        python -m flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics >> ${lintFile} 2>&1 || true  # Continúa si falla
                                        echo "" >> ${lintFile}  # Separador
                                    """
                                    break
                                case 'js':
                                    // Linter para JS: eslint (asumiendo instalado via npm global o local)
                                    sh """
                                        echo "Lint de ${file} (eslint):" >> ${lintFile}
                                        eslint '${file}' >> ${lintFile} 2>&1 || true
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

                    // Verificación final de lint.txt
                    sh "ls -l ${lintFile}"
                    sh "cat ${lintFile} || echo 'Lint vacío'"

                    // Aquí puedes pasar lint.txt a la IA (e.g., readFile y enviar)
                    def lintContent = readFile(lintFile)
                    echo "Output de linters listo para IA: ${lintContent.take(500)}..."  // Preview
                    // Ejemplo: sh "node reviewer.js '${diffFile}' '${lintFile}'"
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