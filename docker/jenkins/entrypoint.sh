#!/bin/bash
set -e

# Check that NGROK_AUTHTOKEN is defined
if [ -z "$NGROK_AUTHTOKEN" ]; then
  echo "ERROR: Debes pasar -e NGROK_AUTHTOKEN=tu_token al hacer docker run"
  exit 1
fi

# Configure the auth token (required the first time)
ngrok config add-authtoken "$NGROK_AUTHTOKEN" || true

echo "Iniciando ngrok tunnel para http://localhost:8080 ..."
# Start ngrok in the background and redirect logs
ngrok http \
  --log stdout \
  8080 \
  --request-header-add "X-Forwarded-Proto: https" &   # Optional: helps with some proxies

# Save the ngrok PID so it can be terminated on shutdown
NGROK_PID=$!

# Wait a bit for ngrok to start and display the URL
sleep 5

echo "===================================================================="
echo "Ngrok debería estar corriendo. Busca la URL forwarding en los logs:"
echo "Ejemplo: https://xxxx.ngrok-free.app -> http://localhost:8080"
echo "Usa esa URL https://xxxx.ngrok-free.app/github-webhook/ para GitHub"
echo "===================================================================="

# Start Jenkins in the foreground (the container's main process)
exec /usr/local/bin/jenkins.sh "$@"

# If Jenkins stops, terminate ngrok as well (although docker stop usually handles it)
kill $NGROK_PID 2>/dev/null || true
