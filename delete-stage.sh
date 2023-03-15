# sudo docker-compose -f docker-compose-stage.yml down
sudo docker-compose -f docker-compose-stage.yml stop

sudo docker volume ls

sudo docker volume rm staging-deploy-pipeline_pgdata
sudo rm -rf database/pgdata

y | sudo docker-compose -f docker-compose-stage.yml rm