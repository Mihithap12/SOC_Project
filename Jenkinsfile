pipeline {
    agent any

    tools {
        maven 'Maven 3.x'
        jdk 'Java 21'
        nodejs 'NodeJS 22.x'
    }

    environment {
        DOCKER_REGISTRY = 'registry.local:5000'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub...'
                checkout scm
            }
        }

        stage('Build and Test Java Backends') {
            steps {
                echo 'Building and testing Spring Boot services...'

                bat '''
                    mvn clean test package
                '''
            }
        }

        stage('Build NodeJS Services') {
            parallel {

                stage('Government Service') {
                    steps {
                        dir('government-service') {
                            bat 'npm install'
                        }
                    }
                }

                stage('NGO Service') {
                    steps {
                        dir('ngo-service') {
                            bat 'npm install'
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
                echo 'Building Docker images...'

                bat """
                    docker build -t ${DOCKER_REGISTRY}/user-service:${IMAGE_TAG} ./user-service
                    docker build -t ${DOCKER_REGISTRY}/farmer-service:${IMAGE_TAG} ./farmer-service
                    docker build -t ${DOCKER_REGISTRY}/buyer-service:${IMAGE_TAG} ./buyer-service
                    docker build -t ${DOCKER_REGISTRY}/marketplace-service:${IMAGE_TAG} ./marketplace-service
                    docker build -t ${DOCKER_REGISTRY}/order-service:${IMAGE_TAG} ./order-service
                    docker build -t ${DOCKER_REGISTRY}/price-service:${IMAGE_TAG} ./price-service
                    docker build -t ${DOCKER_REGISTRY}/payment-service:${IMAGE_TAG} ./payment-service
                    docker build -t ${DOCKER_REGISTRY}/transport-service:${IMAGE_TAG} ./transport-service
                    docker build -t ${DOCKER_REGISTRY}/notification-service:${IMAGE_TAG} ./notification-service
                    docker build -t ${DOCKER_REGISTRY}/weather-service:${IMAGE_TAG} ./weather-service

                    docker build -t ${DOCKER_REGISTRY}/government-service:${IMAGE_TAG} ./government-service
                    docker build -t ${DOCKER_REGISTRY}/ngo-service:${IMAGE_TAG} ./ngo-service

                    docker build -t ${DOCKER_REGISTRY}/frontend-farmer:${IMAGE_TAG} ./frontend-farmer
                    docker build -t ${DOCKER_REGISTRY}/frontend-government:${IMAGE_TAG} ./frontend-government
                    docker build -t ${DOCKER_REGISTRY}/frontend-ngo:${IMAGE_TAG} ./frontend-ngo
                """
            }
        }

        stage('Push Docker Images') {
            steps {
                echo 'Pushing Docker images to registry...'

                bat """
                    docker push ${DOCKER_REGISTRY}/user-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/farmer-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/buyer-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/marketplace-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/order-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/price-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/payment-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/transport-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/notification-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/weather-service:${IMAGE_TAG}

                    docker push ${DOCKER_REGISTRY}/government-service:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/ngo-service:${IMAGE_TAG}

                    docker push ${DOCKER_REGISTRY}/frontend-farmer:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/frontend-government:${IMAGE_TAG}
                    docker push ${DOCKER_REGISTRY}/frontend-ngo:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy Infrastructure') {
            steps {
                echo 'Deploying MySQL and MongoDB...'

                bat '''
                    kubectl apply -f k8s/mysql-mongodb-infrastructure.yaml
                '''
            }
        }

        stage('Deploy Applications') {
            steps {
                echo 'Deploying application Kubernetes resources...'

                bat '''
                    kubectl apply -f k8s/farmer-backend-services.yaml
                    kubectl apply -f k8s/nodejs-backend-services.yaml
                    kubectl apply -f k8s/react-frontend-services.yaml
                '''
            }
        }

        stage('Update Application Images') {
            steps {
                echo 'Updating Kubernetes deployments to the new Docker images...'

                bat """
                    kubectl set image deployment/user-service user-service=${DOCKER_REGISTRY}/user-service:${IMAGE_TAG}
                    kubectl set image deployment/farmer-service farmer-service=${DOCKER_REGISTRY}/farmer-service:${IMAGE_TAG}
                    kubectl set image deployment/buyer-service buyer-service=${DOCKER_REGISTRY}/buyer-service:${IMAGE_TAG}
                    kubectl set image deployment/marketplace-service marketplace-service=${DOCKER_REGISTRY}/marketplace-service:${IMAGE_TAG}
                    kubectl set image deployment/order-service order-service=${DOCKER_REGISTRY}/order-service:${IMAGE_TAG}
                    kubectl set image deployment/price-service price-service=${DOCKER_REGISTRY}/price-service:${IMAGE_TAG}
                    kubectl set image deployment/payment-service payment-service=${DOCKER_REGISTRY}/payment-service:${IMAGE_TAG}
                    kubectl set image deployment/transport-service transport-service=${DOCKER_REGISTRY}/transport-service:${IMAGE_TAG}
                    kubectl set image deployment/notification-service notification-service=${DOCKER_REGISTRY}/notification-service:${IMAGE_TAG}
                    kubectl set image deployment/weather-service weather-service=${DOCKER_REGISTRY}/weather-service:${IMAGE_TAG}

                    kubectl set image deployment/government-service government-service=${DOCKER_REGISTRY}/government-service:${IMAGE_TAG}
                    kubectl set image deployment/ngo-service ngo-service=${DOCKER_REGISTRY}/ngo-service:${IMAGE_TAG}

                    kubectl set image deployment/frontend-farmer frontend-farmer=${DOCKER_REGISTRY}/frontend-farmer:${IMAGE_TAG}
                    kubectl set image deployment/frontend-government frontend-government=${DOCKER_REGISTRY}/frontend-government:${IMAGE_TAG}
                    kubectl set image deployment/frontend-ngo frontend-ngo=${DOCKER_REGISTRY}/frontend-ngo:${IMAGE_TAG}
                """
            }
        }

        stage('Wait for Deployment') {
            steps {
                echo 'Waiting for Kubernetes deployments...'

                bat '''
                    kubectl rollout status deployment/user-service
                    kubectl rollout status deployment/farmer-service
                    kubectl rollout status deployment/buyer-service
                    kubectl rollout status deployment/marketplace-service
                    kubectl rollout status deployment/order-service
                    kubectl rollout status deployment/price-service
                    kubectl rollout status deployment/payment-service
                    kubectl rollout status deployment/transport-service
                    kubectl rollout status deployment/notification-service
                    kubectl rollout status deployment/weather-service

                    kubectl rollout status deployment/government-service
                    kubectl rollout status deployment/ngo-service

                    kubectl rollout status deployment/frontend-farmer
                    kubectl rollout status deployment/frontend-government
                    kubectl rollout status deployment/frontend-ngo
                '''
            }
        }

        stage('Verify Kubernetes') {
            steps {
                echo 'Checking Kubernetes cluster...'

                bat '''
                    kubectl get pods
                    kubectl get services
                '''
            }
        }
    }

    post {
        success {
            echo 'AgriChain CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the stage logs above.'
        }
    }
}