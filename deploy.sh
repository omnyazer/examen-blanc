#!/bin/sh
set -e

cd backend
npm ci
npm test
cd ..

cd frontend
npm ci
npm run build
cd ..

docker compose build
