#!/bin/bash
echo "mongo restore"
if [ "$(mongo --eval 'db.getMongo().getDBNames().indexOf("commission-calculator")' --quiet)" -lt 0 ]; then
  mongorestore --gzip /db-dump
fi