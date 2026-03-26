pipeline {
    agent any

    // environment {
    //     APP_NAME = "chat-app"
    //     DEPLOY_USER = "ubuntu"
    //     DEPLOY_HOST = "10.0.2.10"       // replace with your private server IP
    //     DEPLOY_PATH = "/var/www/${APP_NAME}"
    // }

    stages {
        stage('Checkout') {
            steps {
                echo "hi"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        // stage('Deploy') {
        //     steps {
        //         // Using SSH to deploy to a server
        //         sh """
        //             ssh ${DEPLOY_USER}@${DEPLOY_HOST} 'mkdir -p ${DEPLOY_PATH}'
        //             rsync -avz --exclude node_modules ./ ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/
        //             ssh ${DEPLOY_USER}@${DEPLOY_HOST} 'cd ${DEPLOY_PATH} && npm install --production && pm2 restart ${APP_NAME} || pm2 start index.js --name ${APP_NAME}'
        //         """
        //     }
        // }
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
