pipeline {
    agent any

     environment{
            COURSE = "Jenkins"
            appVersion = ""
            ACC_ID = "471112667143"
            PROJECT = "realtime-chat-app"
            COMPONENT = "frontend"
          }


    stages {

      stage ('Read Version'){
                steps{
                  script{
                    def packageJSON = readJSON file: 'package.json'
                    appVersion= packageJSON.version
                    echo "app version: ${appVersion}"
                  }
                }
            }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

       stage('Build Image'){
              steps{
                script{
                  withAWS(region:'us-east-1',credentials:'aws-creds') {
                    sh """
                            aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ACC_ID}.dkr.ecr.us-east-1.amazonaws.com
                            docker build -t ${PROJECT}/${COMPONENT}:${appVersion} .
                            docker tag ${PROJECT}/${COMPONENT}:${appVersion} ${ACC_ID}.dkr.ecr.us-east-1.amazonaws.com/${PROJECT}/${COMPONENT}:${appVersion}
                            docker images
                            docker push ${ACC_ID}.dkr.ecr.us-east-1.amazonaws.com/${PROJECT}/${COMPONENT}:${appVersion}
                    """
                    }

                }
              }
            }
        stage('Deploy'){
          steps{
            script{
              withAWS(region:'us-east-1',credentials:'aws-creds') {
                sh """
                docker stop ${COMPONENT} || true
                docker rm ${COMPONENT} || true

                docker run -d --name ${COMPONENT} -p 3000:3000 \
                ${ACC_ID}.dkr.ecr.us-east-1.amazonaws.com/${PROJECT}/${COMPONENT}:${appVersion}
                """
              }
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
