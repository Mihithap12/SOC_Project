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
                echo 'Checking out source repository...'
                checkout scm
            }
        }

        stage('Build Java Backends') {
            steps {
                echo 'Compiling and packaging multi-module Spring Boot backend services...'
                bat 'mvn clean package -DskipTests'
            }
        }

        stage('Test Java Backends') {
            steps {
                echo 'Running unit and integration tests...'
                bat 'mvn test'
            }
        }

        stage('Build NodeJS Services') {
            parallel {
                stage('Government Service') {
                    steps {
                        dir('government-service') {
                            echo 'Building NodeJS Government Service...'
                            bat 'npm install'
                        }
                    }
                }
                stage('NGO Service') {
                    steps {
                        dir('ngo-service') {
                            echo 'Building NodeJS NGO Service...'
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
                            echo 'Building React Farmer Front-end...'
                            bat 'npm install'
                            bat 'npm run build'
                        }
                    }
                }
                stage('Frontend Government') {
                    steps {
                        dir('frontend-government') {
                            echo 'Building React Government Front-end...'
                            bat 'npm install'
                            bat 'npm run build'
                        }
                    }
                }
                stage('Frontend NGO') {
                    steps {
                        dir('frontend-ngo') {
                            echo 'Building React NGO Front-end...'
                            bat 'npm install'
                            bat 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Dockerize & Publish') {
            steps {
                echo 'Building and tagging container images for all microservices...'
                // Simulating container registry push
                echo "docker build -t ${DOCKER_REGISTRY}/user-service:${IMAGE_TAG} ./user-service"
                echo "docker build -t ${DOCKER_REGISTRY}/government-service:${IMAGE_TAG} ./government-service"
                echo "docker build -t ${DOCKER_REGISTRY}/frontend-farmer:${IMAGE_TAG} ./frontend-farmer"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Applying Kubernetes manifests to the cluster...'
                echo "kubectl apply -f k8s/mysql-mongodb-infrastructure.yaml"
                echo "kubectl apply -f k8s/farmer-backend-services.yaml"
                echo "kubectl apply -f k8s/nodejs-backend-services.yaml"
                echo "kubectl apply -f k8s/react-frontend-services.yaml"
            }
        }
    }

    post {
        success {
            echo 'AgriChain Supply Chain Pipeline execution completed successfully!'
        }
        failure {
            echo 'Pipeline execution failed. Please inspect logs.'
        }
    }
}
