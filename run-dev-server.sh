export COMMIT_TAG="commit-$(git rev-parse --short HEAD)"
echo "Working with commit tag: ${COMMIT_TAG}"

# docker-compose -f docker-compose-dev.yml up -d
sudo chown -R ${USER} database
docker-compose -f docker-compose-dev-server.yml up --build
# docker-compose -f docker-compose-dev.yml up --build -d

# docker-compose -f docker-compose-dev.yml run pgadmin db

# docker-compose -f docker-compose-dev.yml exec api /bin/bash
# docker-compose -f docker-compose-dev.yml build client
# docker-compose -f docker-compose-dev.yml run client

# docker-compose -f docker-compose-dev.yml up api


# docker-compose -f docker-compose-dev.yml down
# docker-compose -f docker-compose-dev.yml rm