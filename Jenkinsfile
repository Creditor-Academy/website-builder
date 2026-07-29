pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -e

                    # Create temporary deployment directory
                    sudo mkdir -p /tmp/buildora-deploy

                    # Clean temporary directory
                    sudo rm -rf /tmp/buildora-deploy/*

                    # Copy new build
                    sudo cp -r dist/* /tmp/buildora-deploy/

                    # Replace old website
                    sudo rm -rf /var/www/html/*
                    sudo cp -r /tmp/buildora-deploy/* /var/www/html/

                    # Set ownership
                    sudo chown -R www-data:www-data /var/www/html

                    # Reload Nginx
                    sudo systemctl reload nginx
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful'
        }

        failure {
            echo 'Deployment Failed'
        }
    }
}