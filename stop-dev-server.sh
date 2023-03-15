docker-compose -f docker-compose-dev.yml down

#dont remove DB just remove services other than DB
# y |   docker-compose -f docker-compose-dev.yml rm api client nginx
