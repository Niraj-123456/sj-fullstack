docker-compose -f ./docker-compose-prod.yml stop certbot
docker-compose -f ./docker-compose-prod.yml stop db
docker-compose -f ./docker-compose-prod.yml down