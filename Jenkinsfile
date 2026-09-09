pipeline {
    agent any

    tools {
        maven 'Maven 3.x'
        jdk 'Java 21'
        nodejs 'NodeJS 22.x'
    }

    environment {
        KUBECONFIG       = 'C:/Users/ASUS/.kube/config'
        PUSH_TO_REGISTRY = 'false'
        DOCKER_REGISTRY  = 'registry.local:5000'
        IMAGE_TAG        = "${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test Java Backends') {
            steps {
                bat 'mvn clean test package'
            }
        }

        stage('Build NodeJS Services') {
            parallel {
                stage('Government Service') {
                    steps {
                        dir('government-service') {
                            bat 'npm install --production'
                        }
                    }
                }
                stage('NGO Service') {
                    steps {
                        dir('ngo-service') {
                            bat 'npm install --production'
                        }
                    }
                }
            }
        }

        stage('Build React Frontends') {
            parallel {
                stage('Frontend Farmer') {
                    steps {
                        dir('frontend-farmer') {
                            bat 'npm install'
                            bat 'npm run build'
                        }
                    }
                }
                stage('Frontend Government') {
                    steps {
                        dir('frontend-government') {
                            bat 'npm install'
                            bat 'npm run build'
                        }
                    }
                }
                stage('Frontend NGO') {
                    steps {
                        dir('frontend-ngo') {
                            bat 'npm install'
                            bat 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat """
                    docker build -t project-user-service:latest -t project-user-service:${IMAGE_TAG} ./user-service
                    docker build -t project-farmer-service:latest -t project-farmer-service:${IMAGE_TAG} ./farmer-service
                    docker build -t project-buyer-service:latest -t project-buyer-service:${IMAGE_TAG} ./buyer-service
                    docker build -t project-marketplace-service:latest -t project-marketplace-service:${IMAGE_TAG} ./marketplace-service
                    docker build -t project-order-service:latest -t project-order-service:${IMAGE_TAG} ./order-service
                    docker build -t project-price-service:latest -t project-price-service:${IMAGE_TAG} ./price-service
                    docker build -t project-payment-service:latest -t project-payment-service:${IMAGE_TAG} ./payment-service
                    docker build -t project-transport-service:latest -t project-transport-service:${IMAGE_TAG} ./transport-service
                    docker build -t project-notification-service:latest -t project-notification-service:${IMAGE_TAG} ./notification-service
                    docker build -t project-weather-service:latest -t project-weather-service:${IMAGE_TAG} ./weather-service

                    docker build -t project-government-service:latest -t project-government-service:${IMAGE_TAG} ./government-service
                    docker build -t project-ngo-service:latest -t project-ngo-service:${IMAGE_TAG} ./ngo-service

                    docker build -t project-frontend-farmer:latest -t project-frontend-farmer:${IMAGE_TAG} ./frontend-farmer
                    docker build -t project-frontend-government:latest -t project-frontend-government:${IMAGE_TAG} ./frontend-government
                    docker build -t project-frontend-ngo:latest -t project-frontend-ngo:${IMAGE_TAG} ./frontend-ngo
                """
            }
        }

        stage('Push Docker Images') {
            when {
                expression { return env.PUSH_TO_REGISTRY == 'true' }
            }
            steps {
                bat """
                    docker push ${DOCKER_REGISTRY}/project-user-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/project-farmer-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/project-buyer-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/project-marketplace-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/project-order-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/project-price-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/project-payment-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/project-transport-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/project-notification-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/project-weather-service:${IMAGE_TAG}

                    docker push ${DOCKER_REGISTRY}/project-government-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/project-ngo-service:${IMAGE_TAG}

                    docker push ${DOCKER_REGISTRY}/project-frontend-farmer:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/project-frontend-government:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/project-frontend-ngo:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy Infrastructure') {
            steps {
                bat 'kubectl apply -f k8s/mysql-mongodb-infrastructure.yaml'
            }
        }

        stage('Deploy Applications') {
            steps {
                bat """
                    kubectl apply -f k8s/farmer-backend-services.yaml
                    kubectl apply -f k8s/nodejs-backend-services.yaml
                    kubectl apply -f k8s/react-frontend-services.yaml
                """
            }
        }

        stage('Rollout & Verify Kubernetes') {
            steps {
                bat """
                    kubectl rollout restart deployment/user-service deployment/farmer-service deployment/buyer-service deployment/marketplace-service deployment/order-service deployment/price-service deployment/payment-service deployment/transport-service deployment/notification-service deployment/weather-service deployment/government-service deployment/ngo-service deployment/frontend-farmer deployment/frontend-government deployment/frontend-ngo
                    kubectl rollout status deployment/user-service --timeout=120s
                    kubectl rollout status deployment/farmer-service --timeout=120s
                    kubectl rollout status deployment/buyer-service --timeout=120s
                    kubectl rollout status deployment/marketplace-service --timeout=120s
                    kubectl rollout status deployment/order-service --timeout=120s
                    kubectl rollout status deployment/price-service --timeout=120s
                    kubectl rollout status deployment/payment-service --timeout=120s
                    kubectl rollout status deployment/transport-service --timeout=120s
                    kubectl rollout status deployment/notification-service --timeout=120s
                    kubectl rollout status deployment/weather-service --timeout=120s
                    kubectl rollout status deployment/government-service --timeout=120s
                    kubectl rollout status deployment/ngo-service --timeout=120s
                    kubectl rollout status deployment/frontend-farmer --timeout=120s
                    kubectl rollout status deployment/frontend-government --timeout=120s
                    kubectl rollout status deployment/frontend-ngo --timeout=120s
                """
            }
        }
    }

    post {
        always {
            bat 'kubectl get pods'
            bat 'kubectl get services'
        }
    }
}