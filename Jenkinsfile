pipeline {
    agent any

    options {
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
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

                    # Make sure build output exists before touching the live site
                    if [ ! -d dist ] || [ -z "$(ls -A dist)" ]; then
                        echo "dist/ is missing or empty. Aborting deploy."
                        exit 1
                    fi

                    # Sync new build to live site (only changes files, removes old ones)
                    sudo rsync -a --delete dist/ /var/www/html/

                    # Set ownership
                    sudo chown -R www-data:www-data /var/www/html

                    # Test Nginx config, then reload
                    sudo nginx -t
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
            echo 'Deployment Failed. Check the stage logs above.'
        }

        always {
            cleanWs()
        }
    }
}