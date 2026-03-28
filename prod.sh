#!/bin/sh
set -e

IMAGE_TAG="${1:-latest}"
IMAGE_NAME="starhead-front:${IMAGE_TAG}"

echo "▶ Build de l'image ${IMAGE_NAME}..."
docker build -t "${IMAGE_NAME}" .

echo "▶ Arrêt du conteneur en cours..."
IMAGE_TAG="${IMAGE_TAG}" docker compose -f docker-compose.prod.yml down

echo "▶ Démarrage avec ${IMAGE_NAME}..."
IMAGE_TAG="${IMAGE_TAG}" docker compose -f docker-compose.prod.yml up -d

echo "✔ Déployé sur http://localhost:11200 (image: ${IMAGE_NAME})"
