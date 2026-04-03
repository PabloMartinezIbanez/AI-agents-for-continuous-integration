# Use the exact version requested
FROM jenkins/jenkins:2.541.1-jdk25

LABEL maintainer="[EMAIL_ADDRESS]"
LABEL description="Jenkins con ngrok integrado para exposición automática vía tunnel y SonarScanner CLI"

# Temporary root user to install dependencies
USER root

# Install required tools and ngrok
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
    rm /tmp/ngrok.zip

# SonarScanner CLI
# Version pinned for reproducible builds; update the number when appropriate
ARG SONAR_SCANNER_VERSION=6.1.0.4477
RUN curl -sSL \
    "https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip" \
    -o /tmp/sonar-scanner.zip && \
    unzip /tmp/sonar-scanner.zip -d /opt/ && \
    mv /opt/sonar-scanner-${SONAR_SCANNER_VERSION}-linux-x64 /opt/sonar-scanner && \
    ln -s /opt/sonar-scanner/bin/sonar-scanner /usr/local/bin/sonar-scanner && \
    rm /tmp/sonar-scanner.zip

# Point the scanner JRE to the JDK already provided by the base image
# (prevents the scanner from downloading its own embedded JRE)
ENV SONAR_SCANNER_OPTS="-Djava.security.egd=file:/dev/./urandom"
RUN sed -i 's|#use_embedded_jre=true|use_embedded_jre=false|' \
    /opt/sonar-scanner/conf/sonar-scanner.properties

# Entrypoint wrapper (Jenkins + ngrok)
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh && \
    git config --global user.name "Jenkins AI Bot" && \
    git config --global user.email "jenkins-ai@noreply.github.com"

# Switch back to the jenkins user (security)
USER jenkins

# Verify installations at build time
RUN java -version && sonar-scanner --version

# Environment variables
# NGROK_AUTHTOKEN is mandatory -> pass it with -e when running the container
ENV NGROK_AUTHTOKEN=""
ENV NGROK_REGION="eu"
ENV JENKINS_OPTS="--httpPort=8080"

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
