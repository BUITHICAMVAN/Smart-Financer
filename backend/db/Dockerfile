FROM postgres:13

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY dbdump.sql /docker-entrypoint-initdb.d/dbdump.sql

EXPOSE 5432
