# 0.0.1 was basic get api



export NEW_VERSION=0.0.1-dev
# export ECR=static-clickable-poster-node-api
export ECR=sahaj-node-api

# # # build with version
docker build -f Dockerfile.prod --target production -t sahaj-node-api:$NEW_VERSION .

# # # # Login into ECR
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 972726008529.dkr.ecr.us-east-2.amazonaws.com/$ECR
# aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 972726008529.dkr.ecr.us-east-2.amazonaws.com/sahaj-node-api-stage


docker tag sahaj-node-api:$NEW_VERSION 972726008529.dkr.ecr.us-east-2.amazonaws.com/$ECR:$NEW_VERSION
docker push 972726008529.dkr.ecr.us-east-2.amazonaws.com/$ECR:$NEW_VERSION


