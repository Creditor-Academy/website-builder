```groovy
pipeline {
    agent any

    environment {
        PUPPETEER_EXECUTABLE_PATH = '/usr/bin/google-chrome'
    }

    options {
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Creditor-Academy/website-builder.git'
            }
        }

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

                    # Verify build output
                    if [ ! -d dist ] || [ -z "$(ls -A dist)" ]; then
                        echo "dist/ is missing or empty. Aborting deployment."
                        exit 1
                    fi

                    # Deploy build to live directory
                    sudo rsync -a --delete dist/ /var/www/frontend/website-builder/dist/

                    # Set correct ownership
                    sudo chown -R www-data:www-data /var/www/frontend/website-builder/dist

                    # Validate Nginx configuration
                    sudo nginx -t

                    # Reload Nginx
                    sudo systemctl reload nginx
                '''
            }
        }
    }

    post {
        success {
            echo 'Web Studio deployment completed successfully.'
        }

        failure {
            echo 'Web Studio deployment failed. Check the stage logs.'
        }

        always {
            cleanWs()
        }
    }
}
```