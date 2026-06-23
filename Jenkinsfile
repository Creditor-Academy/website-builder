pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'buildora-frontend'
        DOCKER_TAG = "v${env.BUILD_NUMBER}"

        // Frontend EC2 (Public) — Jenkins can SSH into this directly
        FRONTEND_IP = '3.81.180.149' // Provided by AWS Team
        SSH_CREDENTIALS_ID = 'frontend-ssh-key' // Jenkins Credentials ID for SSH Key

        // Backend private IP injected into nginx.conf at build time
        BACKEND_PRIVATE_IP = '10.3.11.153'

        // Vite build-time environment variables
        VITE_API_BASE_URL = '/api/v1'
        VITE_SITE_HOST = 'https://buildora.lmsathena.com'
        VITE_GOOGLE_CLIENT_ID = credentials('google-client-id') // Stored in Jenkins credentials
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Inject Backend IP') {
            steps {
                // Replace the placeholder in nginx.conf with the actual backend private IP
                sh "sed -i 's/<BACKEND_PRIVATE_IP>/${BACKEND_PRIVATE_IP}/g' nginx.conf"
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        docker build \
                            --build-arg VITE_API_BASE_URL=${VITE_API_BASE_URL} \
                            --build-arg VITE_SITE_HOST=${VITE_SITE_HOST} \
                            --build-arg VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID} \
                            -t ${DOCKER_IMAGE}:${DOCKER_TAG} \
                            -t ${DOCKER_IMAGE}:latest \
                            .
                    """
                }
            }
        }

        stage('Deploy to Frontend EC2') {
            steps {
                sshagent([SSH_CREDENTIALS_ID]) {
                    script {
                        // 1. Export the docker image to a tar archive
                        sh "docker save ${DOCKER_IMAGE}:latest -o buildora-frontend.tar"

                        // 2. SCP the image and docker-compose to the Frontend EC2
                        sh "scp -o StrictHostKeyChecking=no buildora-frontend.tar ubuntu@${FRONTEND_IP}:/home/ubuntu/"
                        sh "scp -o StrictHostKeyChecking=no docker-compose.yml ubuntu@${FRONTEND_IP}:/home/ubuntu/"

                        // 3. Load the image and restart the service on the Frontend EC2
                        sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${FRONTEND_IP} '
                            cd /home/ubuntu
                            docker load -i buildora-frontend.tar
                            docker compose up -d --no-deps frontend
                            rm buildora-frontend.tar
                        '
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
        }
        success {
            echo "Frontend deployment to EC2 (${FRONTEND_IP}) successful!"
        }
        failure {
            echo "Frontend deployment failed! Please check logs."
        }
    }
}
