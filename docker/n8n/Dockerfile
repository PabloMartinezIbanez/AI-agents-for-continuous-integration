FROM python:3.11-slim AS python-builder

FROM n8nio/n8n:2.7.3

USER root

COPY --from=python-builder /usr/local /usr/local

USER node
EXPOSE 5000