#!groovy

def tryStep(String message, Closure block, Closure tearDown = null) {
    try {
        block();
    }
    catch (Throwable t) {
        slackSend message: "${env.JOB_NAME}: ${message} failure ${env.BUILD_URL}", channel: '#ci-channel', color: 'danger'

        throw t;
    }
    finally {
        if (tearDown) {
            tearDown();
        }
    }
}

String BRANCH = "${env.BRANCH_NAME}"
String PROJECT_PREFIX = "${env.BRANCH_NAME}_${env.BUILD_NUMBER}_"

node {
    stage("Checkout") {
        checkout scm
    }

    stage('Deploy Bakkie') {
        if(BRANCH != "master") {
            tryStep "bakkie", {
                sh "scripts/bakkie.sh ${BRANCH}"
            }
        }
    }

    stage('Unit tests') {
      String PROJECT = "${PROJECT_PREFIX}unit"
      tryStep "unit tests", {
        sh "docker-compose -p ${PROJECT} up --build --exit-code-from test test"
      },
      {
          sh "docker-compose -p ${PROJECT} down -v || true"
      }
    }
    
    stage("Build image") {
        tryStep "build", {
            def image = docker.build("build.datapunt.amsterdam.nl:5000/atlas/dcatd_admin:${env.BUILD_NUMBER}")
            image.push()
        }
    }
}


if (BRANCH == "master") {

    node {
        stage('Push acceptance image') {
            tryStep "image tagging", {
                def image = docker.image("build.datapunt.amsterdam.nl:5000/atlas/dcatd_admin:${env.BUILD_NUMBER}")
                image.pull()
                image.push("acceptance")
            }
        }
    }

    node {
        stage("Deploy to ACC") {
            tryStep "deployment", {
                build job: 'Subtask_Openstack_Playbook',
                parameters: [
                    [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
                    [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-dcatd-admin.yml'],
                    [$class: 'StringParameterValue', name: 'BRANCH', value: 'master'],

                ]
            }
        }
    }


    stage('Waiting for approval') {
        slackSend channel: '#ci-channel', color: 'warning', message: 'Dcatd-Admin is waiting for Production Release - please confirm'
        input "Deploy to Production?"
    }

    node {
        stage("Build production image") {
            tryStep "build", {
                def image = docker.build("build.datapunt.amsterdam.nl:5000/atlas/dcatd_admin:${env.BUILD_NUMBER}", "--build-arg NODE_ENV=production .")
                image.push("production")
                image.push("lastest")
            }
        }
    }

    node {
        stage("Deploy") {
            tryStep "deployment", {
                build job: 'Subtask_Openstack_Playbook',
                parameters: [
                    [$class: 'StringParameterValue', name: 'INVENTORY', value: 'production'],
                    [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-dcatd-admin.yml'],
                    [$class: 'StringParameterValue', name: 'BRANCH', value: 'master'],
                ]
            }
        }
    }
}
