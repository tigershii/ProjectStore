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
                    try {
                        if (env.TAG_NAME) {
                            env.IMAGE_VERSION = env.TAG_NAME.replace("v", "")
                            env.IS_RELEASE_BUILD = 'true'
                            echo "Release Build from Git Tag. Version: ${env.IMAGE_VERSION}"
                        } else {
                            def commitMessage = sh(script: 'git log -1 --pretty=%B || echo "No commit message"', returnStdout: true).trim()
                            echo "Commit message: ${commitMessage}"
                            
                            def versionPrefix = "version:"
                            def versionIdx = commitMessage.toLowerCase().indexOf(versionPrefix)
                            
                            if (versionIdx >= 0) {
                                def afterPrefix = commitMessage.substring(versionIdx + versionPrefix.length()).trim()
                                def endIdx = afterPrefix.indexOf(' ')
                                
                                if (endIdx < 0) {
                                    endIdx = afterPrefix.length()
                                }
                                
                                if (endIdx > 0) {
                                    env.IMAGE_VERSION = afterPrefix.substring(0, endIdx).trim()
                                    echo "Found version in commit message: ${env.IMAGE_VERSION}"
                                } else {
                                    env.IMAGE_VERSION = "0.1.0-dev.${env.BUILD_NUMBER}"
                                    echo "Invalid version format in commit message, using default: ${env.IMAGE_VERSION}"
                                }
                                
                                if (commitMessage.toLowerCase().contains("[release=true]") || 
                                    commitMessage.toLowerCase().contains("[release:true]")) {
                                    env.IS_RELEASE_BUILD = 'true'
                                    echo "Release Build from commit message. Version: ${env.IMAGE_VERSION}"
                                } else {
                                    env.IS_RELEASE_BUILD = 'false'
                                    echo "Development Build with version from commit message: ${env.IMAGE_VERSION}"
                                }
                            } else {
                                sh(script: 'git fetch --tags || true')
                                def latestTag = sh(script: 'git describe --tags --abbrev=0 2>/dev/null || echo "v0.1.0"', returnStdout: true).trim()
                                
                                def baseVersion = latestTag.replace("v", "")
                                env.IMAGE_VERSION = "${baseVersion}-dev.${env.BUILD_NUMBER}.${env.GIT_COMMIT_SHORT}"
                                env.IS_RELEASE_BUILD = 'false'
                                echo "Using generated version: ${env.IMAGE_VERSION}"
                            }
                        }
                    } catch (Exception e) {
                        echo "Error in Determine Version stage: ${e.message}"
                        env.IMAGE_VERSION = "0.0.0-error.${env.BUILD_NUMBER}"
                        env.IS_RELEASE_BUILD = 'false'
                        echo "Using fallback version due to error: ${env.IMAGE_VERSION}"
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

                    docker.withRegistry("https://${env.GAR_LOCATION}-docker.pkg.dev", '') {
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