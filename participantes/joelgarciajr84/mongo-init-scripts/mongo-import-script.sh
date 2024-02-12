#!/bin/bash

until mongosh --host localhost:27017 --eval "quit()" &> /dev/null; do
    echo "Waiting for MongoDB to start..."
    sleep 1
done

mongoimport --db rinha --collection clientes --type json --file /mongo-init-scripts/seed.json --jsonArray

