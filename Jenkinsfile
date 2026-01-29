pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'pam2002'
        ANSIBLE_INVENTORY = "ansible/inventory.ini"
        ANSIBLE_PLAYBOOK = "ansible/deploy.yml"

    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ChathuniRathnayake/DevOps.git'
            }
        }

        stage('Terraform Init') {
            steps {
                dir("${WORKSPACE}") {
                sh 'terraform init -upgrade'
                }   
            }
        }

        stage('Terraform Plan') {
            steps {
                dir("${WORKSPACE}") {
                    sh 'terraform plan -out=tfplan'
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                dir("${WORKSPACE}") {
                    sh 'terraform apply -auto-approve tfplan'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'chmod +x ./scripts/build.sh'
                sh './scripts/build.sh'
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    sh 'chmod +x ./scripts/push.sh'
                    sh './scripts/push.sh'
                }
            }
        }

        stage('Deploy via Ansible') {
            steps {
                sh "ansible-playbook -i $ANSIBLE_INVENTORY $ANSIBLE_PLAYBOOK"
            }
        }


    
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs.'
        }
    }
}
