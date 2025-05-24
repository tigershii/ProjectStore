// Jenkinsfile
pipeline {
    agent any

    environment {
        GCP_PROJECT_ID           = 'kubernetes-cluster-458203'
        GAR_LOCATION             = 'us-west1'
        GAR_REPOSITORY_NAME      = 'project-store' 
        BACKEND_IMAGE_NAME       = 'backend'
        FRONTEND_IMAGE_NAME      = 'frontend'
        GCP_CREDENTIALS_ID       = 'gcp-artifact-registry-writer'
        
        BACKEND_IMAGE_FULL_NAME_NO_TAG  = "${env.GAR_LOCATION}-docker.pkg.dev/${env.GCP_PROJECT_ID}/${env.GAR_REPOSITORY_NAME}/${env.BACKEND_IMAGE_NAME}"
        FRONTEND_IMAGE_FULL_NAME_NO_TAG = "${env.GAR_LOCATION}-docker.pkg.dev/${env.GCP_PROJECT_ID}/${env.GAR_REPOSITORY_NAME}/${env.FRONTEND_IMAGE_NAME}"

        IMAGE_VERSION            = ''
        IS_RELEASE_BUILD         = 'false'

        BACKEND_BUILT            = 'false'
        FRONTEND_BUILT           = 'false'
        
        EMAIL_RECIPIENTS         = 'tigershi08@gmail.com'
        PROJECT_NAME             = 'Project Store'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10')) 
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    echo "Checked out branch: ${env.BRANCH_NAME}, Commit: ${env.GIT_COMMIT_SHORT}"
                }
            }
        }

        stage('Determine Version') {
            steps {
                script {
                    if (env.TAG_NAME) {
                        env.IMAGE_VERSION = env.TAG_NAME.replace("v", "")
                        env.IS_RELEASE_BUILD = 'true'
                        echo "Release Build from Git Tag. Version: ${env.IMAGE_VERSION}"
                    } else {
                        env.IMAGE_VERSION = "dev-${env.BRANCH_NAME.replaceAll('/', '-')}-${env.BUILD_NUMBER}-${env.GIT_COMMIT_SHORT}"
                        env.IS_RELEASE_BUILD = 'false'
                        echo "Development Build from branch ${env.BRANCH_NAME}. Version: ${env.IMAGE_VERSION}"
                    }
                }
            }
        }

        stage('Build & Push Backend') {
            when {
                expression {
                    return hasBackendChanges()
                }
            }
            steps {
                script {
                    echo "Building Backend with version: ${env.IMAGE_VERSION}"
                    def fullImageWithTag = "${env.BACKEND_IMAGE_FULL_NAME_NO_TAG}:${env.IMAGE_VERSION}"

                    withCredentials([file(credentialsId: env.GCP_CREDENTIALS_ID, variable: 'GCP_SA_KEY_PATH')]) {
                        sh "gcloud auth activate-service-account --key-file=${GCP_SA_KEY_PATH} --project=${env.GCP_PROJECT_ID}"
                        sh "gcloud auth configure-docker ${env.GAR_LOCATION}-docker.pkg.dev --quiet"
                    }

                    docker.withRegistry("https://${env.GAR_LOCATION}-docker.pkg.dev", '') { // No specific Jenkins credential needed here if gcloud auth configure-docker is used
                        def customImage = docker.build(fullImageWithTag, "-f backend/Dockerfile backend/")
                        customImage.push()
                        echo "Pushed Backend image: ${fullImageWithTag}"
                    }
                    env.BACKEND_BUILT = 'true'
                }
            }
        }

        stage('Build & Push Frontend') {
            when {
                expression {
                    return env.IS_RELEASE_BUILD == 'true' || (
                        currentBuild.changeSets.any { changeSet ->
                            changeSet.items.any { item ->
                                item.affectedPaths.any { path ->
                                    path.startsWith('frontend/')
                                }
                            }
                        } && env.IS_RELEASE_BUILD == 'false'
                    )
                }
            }
            steps {
                script {
                    echo "Building Frontend with version: ${env.IMAGE_VERSION}"
                    def fullImageWithTag = "${env.FRONTEND_IMAGE_FULL_NAME_NO_TAG}:${env.IMAGE_VERSION}"

                    withCredentials([file(credentialsId: env.GCP_CREDENTIALS_ID, variable: 'GCP_SA_KEY_PATH')]) {
                        sh "gcloud auth activate-service-account --key-file=${GCP_SA_KEY_PATH} --project=${env.GCP_PROJECT_ID}"
                        sh "gcloud auth configure-docker ${env.GAR_LOCATION}-docker.pkg.dev --quiet"
                    }

                    docker.withRegistry("https://${env.GAR_LOCATION}-docker.pkg.dev", '') {
                        def customImage = docker.build(fullImageWithTag, "-f frontend/Dockerfile frontend/")
                        customImage.push()
                        echo "Pushed Frontend image: ${fullImageWithTag}"
                    }
                    env.FRONTEND_BUILT = 'true'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
            cleanWs()
        }
        success {
            echo 'Pipeline Succeeded!'
            emailext (
                subject: "[${env.PROJECT_NAME}] SUCCESS: Build #${env.BUILD_NUMBER} - ${env.IMAGE_VERSION}",
                body: """<html>
                    <body>
                        <h2>✅ Build Successful!</h2>
                        <p><b>Project:</b> ${env.PROJECT_NAME}</p>
                        <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                        <p><b>Version:</b> ${env.IMAGE_VERSION}</p>
                        <p><b>Branch/Tag:</b> ${env.TAG_NAME ?: env.BRANCH_NAME}</p>
                        <p><b>Changes:</b></p>
                        <ul>
                            ${currentBuild.changeSets.collect { cs ->
                                cs.items.collect { item ->
                                    "<li>${item.msg} - by ${item.author}</li>"
                                }.join("")
                            }.join("")}
                        </ul>
                        <p><b>Images built:</b></p>
                        <ul>
                            ${env.BACKEND_BUILT == 'true' ? "<li>Backend: ${env.BACKEND_IMAGE_FULL_NAME_NO_TAG}:${env.IMAGE_VERSION}</li>" : ""}
                            ${env.FRONTEND_BUILT == 'true' ? "<li>Frontend: ${env.FRONTEND_IMAGE_FULL_NAME_NO_TAG}:${env.IMAGE_VERSION}</li>" : ""}
                        </ul>
                        <p><a href='${env.BUILD_URL}'>View Build Details</a></p>
                    </body>
                </html>""",
                mimeType: 'text/html',
                to: "${env.EMAIL_RECIPIENTS}",
                attachLog: true
            )
        }
        failure {
            echo 'Pipeline Failed!'
            emailext (
                subject: "[${env.PROJECT_NAME}] FAILED: Build #${env.BUILD_NUMBER} - ${env.IMAGE_VERSION}",
                body: """<html>
                    <body>
                        <h2>❌ Build Failed!</h2>
                        <p><b>Project:</b> ${env.PROJECT_NAME}</p>
                        <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                        <p><b>Version:</b> ${env.IMAGE_VERSION}</p>
                        <p><b>Branch/Tag:</b> ${env.TAG_NAME ?: env.BRANCH_NAME}</p>
                        <p><b>Error:</b> The build failed. Please check the attached log for details.</p>
                        <p><a href='${env.BUILD_URL}console'>View Console Output</a></p>
                        <p><a href='${env.BUILD_URL}'>View Build Details</a></p>
                    </body>
                </html>""",
                mimeType: 'text/html',
                to: "${env.EMAIL_RECIPIENTS}",
                attachLog: true
            )
        }
    }
}

def hasBackendChanges() {
    if (env.IS_RELEASE_BUILD == 'true' || currentBuild.changeSets.isEmpty()) {
        return true
    }
    
    return currentBuild.changeSets.any { changeSet ->
        changeSet.items.any { item ->
            item.affectedPaths.any { path ->
                path.startsWith('backend/')
            }
        }
    }
}

def hasFrontendChanges() {
    if (env.IS_RELEASE_BUILD == 'true' || currentBuild.changeSets.isEmpty()) {
        return true
    }
    
    return currentBuild.changeSets.any { changeSet ->
        changeSet.items.any { item ->
            item.affectedPaths.any { path ->
                path.startsWith('frontend/')
            }
        }
    }
}