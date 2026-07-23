#!/bin/sh

/run.sh &
GRAFANA_PID=$!

until wget -qO- http://localhost:3000/api/health 2>/dev/null | grep -q "ok"; do
  sleep 2
done

grafana-cli admin reset-admin-password "$GF_SECURITY_ADMIN_PASSWORD"

wait $GRAFANA_PID
