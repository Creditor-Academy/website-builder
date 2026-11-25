pipeline {
    agent any

    options {
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }

    stages {

        stage('Prepare Environment') {
            steps {
                sh '''
                    set -e

                    # Prepare only required public frontend variables
                    # from the server-side .env file.
                    # PEXELS_API_KEY is intentionally excluded because
                    # Pexels is handled by the backend in production.

                    awk -F= '
                        /^VITE_API_BASE_URL=/ { print }
                        /^VITE_SITE_HOST=/ { print }
                        /^VITE_GOOGLE_CLIENT_ID=/ { print }
                        /^VITE_GTM_ID=/ { print }
                    ' /var/www/frontend/website-builder/.env > .env

                    chmod 600 .env

                    echo "Frontend build environment prepared."
                '''
            }
        }

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

                    # Make sure build output exists before touching the live site
                    if [ ! -d dist ] || [ -z "$(ls -A dist)" ]; then
                        echo "dist/ is missing or empty. Aborting deploy."
                        exit 1
                    fi

                    # Sync new build to live site
                    sudo rsync -a --delete dist/ /var/www/frontend/website-builder/dist/

                    # Set ownership
                    sudo chown -R www-data:www-data /var/www/frontend/website-builder/dist

                    # Test Nginx configuration
                    sudo nginx -t

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
            echo 'Deployment Failed. Check the stage logs above.'
        }

        always {
            cleanWs()
        }
    }
}