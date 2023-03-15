pipeline {
	agent any
    
    environment {
        APP_VERSION = '0.0.1'
    }

    stages {

        stage('Cloning Source Repository') {
            steps {
                sh script:'''
                    #!/bin/bash
                    echo 'Cloning began......'
                '''
                checkout scm
                
            }
        }

        stage('Removing past containers') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh script:'''
                        #!/bin/bash
                        echo 'Repo removal began......'
                        cd /var/lib/jenkins/workspace/sj-fullstack-prod-cicd-constant
                        workfolder=$(pwd)
                        
                        sudo chmod +x *.sh
                        docker container stop sahaj_certbot_prod
                        docker container rm sahaj_certbot_prod

                        docker container stop sahaj_db_prod
                        docker container rm sahaj_db_prod

                        docker container stop sahaj_pgadmin4_prod
                        docker container rm sahaj_pgadmin4_prod

                        docker container stop sahaj_api_prod
                        docker container rm sahaj_api_prod

                        docker container stop sahaj_client_prod
                        docker container rm sahaj_client_prod

                        docker container stop sahaj_staff_prod
                        docker container rm sahaj_staff_prod

                        docker container stop sahaj_nginx_prod
                        docker container rm sahaj_nginx_prod
                        '''  
                }
            }
        }

        stage('Building and starting new containers') {
            steps {
                sh script:'''
                    #!/bin/bash
                    echo 'Building and restarting......'
                    
                    cd /var/lib/jenkins/workspace/sj-fullstack-prod-cicd-constant
                    workfolder=$(pwd)
                    echo $workfolder

                    sudo cp -rf /home/ubuntu/cerbot-for-jenkins/certbot ./
                    
                    sudo chmod +x *.sh
                    cd ../../
                    sudo chmod -R 755 workspace
                    cd $workfolder
                    cat staff/Dockerfile.prod

                    ./run-prod.sh
                    '''  
            }
        }

    
    }

}