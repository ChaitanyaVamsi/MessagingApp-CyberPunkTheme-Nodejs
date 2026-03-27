pipeline {
    agent any

    environment {
        COURSE = "Jenkins"
        appVersion = ""
        ACC_ID = "471112667143"
        PROJECT = "realtime-chat-app"
        COMPONENT = "frontend"
    }

    stages {

        stage('Extract App Version from package.json') {
            steps {
                script {
                    def packageJSON = readJSON file: 'package.json'
                    appVersion = packageJSON.version
                    echo "app version: ${appVersion}"
                }
            }
        }

        stage('Install Node Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build & Push Docker Image to AWS ECR') {
            steps {
                script {
                    sh """
                        aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ACC_ID}.dkr.ecr.us-east-1.amazonaws.com
                        docker build -t ${PROJECT}/${COMPONENT}:${appVersion} .
                        docker tag ${PROJECT}/${COMPONENT}:${appVersion} ${ACC_ID}.dkr.ecr.us-east-1.amazonaws.com/${PROJECT}/${COMPONENT}:${appVersion}
                        docker push ${ACC_ID}.dkr.ecr.us-east-1.amazonaws.com/${PROJECT}/${COMPONENT}:${appVersion}
                    """
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    sh """
                        # ✅ Export the version so compose can read it
                        export APP_VERSION=${appVersion}
                        export ACC_ID=${ACC_ID}

                        # Pull latest images
                        docker compose pull

                        # Recreate only the frontend container, keep others running
                        docker compose up -d --no-deps --force-recreate frontend

                        # Verify
                        docker compose ps
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed."
        }
    }
}