#!/bin/bash
set -e

# Verificar que NGROK_AUTHTOKEN esté definido
if [ -z "$NGROK_AUTHTOKEN" ]; then
  echo "ERROR: Debes pasar -e NGROK_AUTHTOKEN=tu_token al hacer docker run"
  exit 1
fi

# Configurar authtoken (necesario la primera vez)
ngrok config add-authtoken "$NGROK_AUTHTOKEN" || true

echo "Iniciando ngrok tunnel para http://localhost:8080 ..."
# Lanzar ngrok en background y redirigir logs
ngrok http \
  --log stdout \
  8080 \
  --request-header-add "X-Forwarded-Proto: https" &   # Opcional: ayuda con algunos proxies

# Guardar PID de ngrok para poder matarlo al parar
NGROK_PID=$!

# Esperar un poco para que ngrok inicie y muestre la URL
sleep 5

echo "===================================================================="
echo "Ngrok debería estar corriendo. Busca la URL forwarding en los logs:"
echo "Ejemplo: https://xxxx.ngrok-free.app -> http://localhost:8080"
echo "Usa esa URL https://xxxx.ngrok-free.app/github-webhook/ para GitHub"
echo "===================================================================="

# Lanzar Jenkins en foreground (el proceso principal del contenedor)
exec /usr/local/bin/jenkins.sh "$@"

# Si Jenkins termina, matar ngrok (aunque normalmente docker stop lo maneja)
kill $NGROK_PID 2>/dev/null || true