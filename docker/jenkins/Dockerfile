# Usamos la versión exacta que pides
FROM jenkins/jenkins:2.541.1-jdk25

LABEL maintainer="[EMAIL_ADDRESS]"
LABEL description="Jenkins con ngrok integrado para exposición automática vía tunnel y SonarScanner CLI"

# Usuario root temporal para instalar dependencias
USER root

# Versión fijada para builds reproducibles; actualiza el número cuando convenga
ARG SONAR_SCANNER_VERSION=6.1.0.4477

# Instalar herramientas necesarias, ngrok y SonarScanner CLI
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    unzip \
    ca-certificates \
    libatomic1 \
    python3 \
    python3.13-venv \
    python3-pip && \
    rm -rf /var/lib/apt/lists/* && \
    curl -sSL https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.zip \
    -o /tmp/ngrok.zip && \
    unzip /tmp/ngrok.zip -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/ngrok && \
    rm /tmp/ngrok.zip && \
    curl -sSL \
    "https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip" \
    -o /tmp/sonar-scanner.zip && \
    unzip /tmp/sonar-scanner.zip -d /opt/ && \
    mv /opt/sonar-scanner-${SONAR_SCANNER_VERSION}-linux-x64 /opt/sonar-scanner && \
    ln -s /opt/sonar-scanner/bin/sonar-scanner /usr/local/bin/sonar-scanner && \
    rm /tmp/sonar-scanner.zip && \
    sed -i 's|#use_embedded_jre=true|use_embedded_jre=false|' \
    /opt/sonar-scanner/conf/sonar-scanner.properties

# Apuntar el JRE del scanner al JDK que ya trae la imagen base
# (evita que el scanner descargue su propio JRE embebido)
ENV SONAR_SCANNER_OPTS="-Djava.security.egd=file:/dev/./urandom"

# Entrypoint wrapper (Jenkins + ngrok)
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Git config global para commits automáticos de la IA
RUN chmod +x /usr/local/bin/entrypoint.sh && \
    git config --global user.name "Jenkins AI Bot" && \
    git config --global user.email "jenkins-ai@noreply.github.com"

# Volver al usuario jenkins (seguridad)
USER jenkins

# Verificar instalaciones en tiempo de build
RUN java -version && sonar-scanner --version

# Variables de entorno
# NGROK_AUTHTOKEN es obligatorio → pásalo como -e al correr el contenedor
ENV NGROK_AUTHTOKEN=""
ENV NGROK_REGION="eu"
ENV JENKINS_OPTS="--httpPort=8080"

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
