pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_HUB_USERNAME = 'pam2002'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/ChathuniRathnayake/DevOps.git'
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    dir('my-react-app') { // path to your frontend folder
                        sh 'docker build -t frontendimage .'
                        sh 'docker tag frontendimage ${DOCKER_HUB_USERNAME}/notesapp-frontend:latest'
                    }
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    dir('backend') { // path to your backend folder
                        sh 'docker build -t backendimage .'
                        sh 'docker tag backendimage ${DOCKER_HUB_USERNAME}/notesapp-backend:latest'
                    }
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh 'echo $PASS | docker login -u $USER --password-stdin'
                        sh 'docker push ${DOCKER_HUB_USERNAME}/notesapp-frontend:latest'
                        sh 'docker push ${DOCKER_HUB_USERNAME}/notesapp-backend:latest'
                    }
                }
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker system prune -f'
            }
        }
    }
}
