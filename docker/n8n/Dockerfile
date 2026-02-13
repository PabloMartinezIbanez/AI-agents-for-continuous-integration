FROM n8nio/n8n:2.7.3

USER root

RUN cd /opt/runners/task-runner-javascript
RUN cd /opt/runners/task-runner-python && uv pip install base64
COPY n8n-task-runners.json /etc/n8n-task-runners.json

USER node