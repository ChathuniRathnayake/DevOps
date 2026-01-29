pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'pam2002'
        ANSIBLE_INVENTORY = "ansible/inventory.ini"
        AWS_KEY     = credentials('aws-access-key')    
        AWS_SECRET  = credentials('aws-secret-key')
        ANSIBLE_PLAYBOOK = "ansible/deploy.yml"
        KUBECONFIG  = '/var/lib/jenkins/.kube/config'
        ANSIBLE_KEY = '/var/lib/jenkins/.ssh/devops-key.pem'

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
        // Kubernetes deployment stage
        stage('Deploy to Kubernetes') {
            steps {
                dir("${WORKSPACE}") {
                    sh """
                    export KUBECONFIG=$KUBECONFIG
                    kubectl apply -f k8s/backend-deployment.yaml
                    kubectl apply -f k8s/backend-service.yaml
                    kubectl apply -f k8s/frontend-deployment.yaml
                    kubectl apply -f k8s/frontend-service.yaml
                    kubectl get pods
                    kubectl get svc
                    """
                }
            }
        }

        stage('Test Kubernetes') {
            steps {
                sh """
                export KUBECONFIG=$KUBECONFIG
                kubectl get nodes
                kubectl get pods -n default
                """
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
