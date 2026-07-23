#!/bin/bash

/usr/local/bin/docker-entrypoint.sh postgres &
PG_PID=$!

NEW_USERNAME="${POSTGRES_USER:-postgres}"
NEW_PASSWORD="${POSTGRES_PASSWORD:-postgres}"

USERNAME_FILE="/var/lib/postgresql/data/.configured_username"
PASSWORD_FILE="/var/lib/postgresql/data/.configured_password"

if [ -f "$USERNAME_FILE" ]; then
    CURRENT_USERNAME=$(cat "$USERNAME_FILE")
else
    CURRENT_USERNAME="$NEW_USERNAME"
fi

if [ -f "$PASSWORD_FILE" ]; then
    CURRENT_PASSWORD=$(cat "$PASSWORD_FILE")
else
    CURRENT_PASSWORD="$NEW_PASSWORD"
fi

echo "[postgres-init] Waiting for PostgreSQL to start..."
until PGPASSWORD="$CURRENT_PASSWORD" psql -U "$CURRENT_USERNAME" -d postgres -c "SELECT 1" > /dev/null 2>&1; do
    sleep 2
done
echo "[postgres-init] PostgreSQL is ready."

if [ "$CURRENT_PASSWORD" != "$NEW_PASSWORD" ]; then
    if PGPASSWORD="$CURRENT_PASSWORD" psql -U "$CURRENT_USERNAME" -d postgres \
        -c "ALTER USER "$CURRENT_USERNAME" WITH PASSWORD '$NEW_PASSWORD';" > /dev/null 2>&1; then
        echo "$NEW_PASSWORD" > "$PASSWORD_FILE"
        CURRENT_PASSWORD="$NEW_PASSWORD"
        echo "[postgres-init] Password updated."
    else
        echo "[postgres-init] Failed to update password."
    fi
else
    echo "$CURRENT_PASSWORD" > "$PASSWORD_FILE"
fi

if [ "$CURRENT_USERNAME" != "$NEW_USERNAME" ]; then
    echo "[postgres-init] Username changed: $CURRENT_USERNAME -> $NEW_USERNAME"

    PGPASSWORD="$CURRENT_PASSWORD" psql -U "$CURRENT_USERNAME" -d postgres \
        -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$NEW_USERNAME') THEN CREATE USER "$NEW_USERNAME" SUPERUSER PASSWORD '$NEW_PASSWORD'; END IF; END \$\$;" > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "[postgres-init] New user created: $NEW_USERNAME"

        for DB in $(PGPASSWORD="$CURRENT_PASSWORD" psql -U "$CURRENT_USERNAME" -d postgres -t -c "SELECT datname FROM pg_database WHERE datistemplate = false;" 2>/dev/null | tr -d ' '); do
            PGPASSWORD="$CURRENT_PASSWORD" psql -U "$CURRENT_USERNAME" -d "$DB" \
                -c "REASSIGN OWNED BY "$CURRENT_USERNAME" TO "$NEW_USERNAME";" > /dev/null 2>&1
            echo "[postgres-init] Reassigned objects in $DB to $NEW_USERNAME"
        done

        PGPASSWORD="$CURRENT_PASSWORD" psql -U "$CURRENT_USERNAME" -d postgres \
            -c "DROP USER IF EXISTS "$CURRENT_USERNAME";" > /dev/null 2>&1

        if [ $? -eq 0 ]; then
            echo "[postgres-init] Old user dropped: $CURRENT_USERNAME"
        else
            echo "[postgres-init] Warning: could not drop old user $CURRENT_USERNAME (may still be in use)"
        fi

        echo "$NEW_USERNAME" > "$USERNAME_FILE"
        echo "$NEW_PASSWORD" > "$PASSWORD_FILE"
        CURRENT_USERNAME="$NEW_USERNAME"
    else
        echo "[postgres-init] Failed to create new username."
    fi
else
    echo "$CURRENT_USERNAME" > "$USERNAME_FILE"
fi

wait $PG_PID
