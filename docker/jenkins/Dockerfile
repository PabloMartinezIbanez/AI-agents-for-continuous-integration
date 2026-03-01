# Usamos la versión exacta que pides
FROM jenkins/jenkins:2.541.1-jdk25

# Etiquetas opcionales para documentación
LABEL maintainer="[EMAIL_ADDRESS]"
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

# Dependencias para compilar Python
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev \
    libssl-dev libreadline-dev libffi-dev libsqlite3-dev wget libbz2-dev \
    tk-dev liblzma-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Descargar, compilar e instalar Python 3.12.7 en /opt/python/3.12
RUN cd /tmp && \
    wget https://www.python.org/ftp/python/3.12.7/Python-3.12.7.tgz && \
    tar -xzf Python-3.12.7.tgz && \
    cd Python-3.12.7 && \
    ./configure --enable-optimizations --prefix=/opt/python/3.12 && \
    make -j$(nproc) && \
    make altinstall && \
    cd /tmp && \
    rm -rf Python-3.12.7 Python-3.12.7.tgz && \
    # Permisos y symlinks
    chown -R jenkins:jenkins /opt/python && \
    chmod -R +x /opt/python/3.12/bin/* && \
    ln -sf /opt/python/3.12/bin/python3.12 /usr/local/bin/python && \
    ln -sf /opt/python/3.12/bin/pip3.12 /usr/local/bin/pip

# Verificar (opcional, pero útil en build)
RUN python --version && pip --version

# Instalar dependencias básicas + cliente Docker (docker-ce-cli)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    gnupg \
    lsb-release \
    && \
    # Añadir la clave oficial de Docker
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    # Añadir el repositorio de Docker
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    # Instalar solo el cliente Docker (no el daemon completo, que no hace falta)
    apt-get install -y docker-ce-cli && \
    # Verificar instalación
    docker --version && \
    # Limpieza para reducir tamaño de la imagen
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Volver al usuario jenkins (seguridad)
USER jenkins

# Variables de entorno recomendadas (puedes sobreescribirlas al hacer docker run)
# NGROK_AUTHTOKEN es obligatorio → pásalo como -e al correr el contenedor
ENV NGROK_AUTHTOKEN=""
ENV NGROK_REGION="eu"
ENV JENKINS_OPTS="--httpPort=8080"



# Usamos un entrypoint custom en lugar del oficial
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]