FROM jenkins/jenkins  
USER root  
RUN curl -L \  
  "https://github.com/docker/compose/releases/download/1.28.0/docker-compose-$(uname -s)-$(uname -m)" \  
  -o /usr/local/bin/docker-compose \  
  && chmod +x /usr/local/bin/docker-compose
RUN mkdir -p /var/jenkins_home/workspace/sj-prod-cicd-pipeline/certbot/www
RUN mkdir -p /var/jenkins_home/workspace/sj-prod-cicd-pipeline/certbot/conf

RUN mkdir -p /var/jenkins_home/workspace/sj-prod-cicd-pipeline/database/pgdata-prod

# USER jenkins