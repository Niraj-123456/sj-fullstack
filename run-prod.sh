export COMMIT_TAG="commit-$(git rev-parse --short HEAD)"
echo "Working with commit tag: ${COMMIT_TAG}"

# docker-compose -f docker-compose-stage.yml up -d
# sudo docker-compose -f docker-compose-stage.yml run client
# sudo docker-compose -f docker-compose-prod.yml up --build -d


# sudo docker-compose -f docker-compose-prod.yml up --build
docker-compose -f ./docker-compose-prod.yml up --build -d
