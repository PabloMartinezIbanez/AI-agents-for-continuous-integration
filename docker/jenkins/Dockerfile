# Usamos la versión exacta que pides
FROM jenkins/jenkins:2.541.1-jdk25

# Etiquetas opcionales para documentación
LABEL maintainer="Tu Nombre <tu@email.com>"
LABEL description="Jenkins con ngrok integrado para exposición automática vía tunnel"

# Usuario root temporal para instalar dependencias
USER root

# Instalar herramientas necesarias (curl + unzip para ngrok)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    unzip \
    ca-certificates \
    libatomic1 &&\
    rm -rf /var/lib/apt/lists/*

# Descargar e instalar ngrok (versión estable más reciente en 2026)
# Puedes fijar una versión concreta si prefieres: https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.zip
RUN curl -sSL https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.zip -o ngrok.zip && \
    unzip ngrok.zip -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/ngrok && \
    rm ngrok.zip

# Crear un entrypoint wrapper para lanzar Jenkins + ngrok en background
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Volver al usuario jenkins (seguridad)
USER jenkins

# Variables de entorno recomendadas (puedes sobreescribirlas al hacer docker run)
# NGROK_AUTHTOKEN es obligatorio → pásalo como -e al correr el contenedor
ENV NGROK_AUTHTOKEN=""
ENV NGROK_REGION="eu"
ENV JENKINS_OPTS="--httpPort=8080"



# Usamos un entrypoint custom en lugar del oficial
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]