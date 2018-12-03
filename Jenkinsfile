pipeline {
  agent any
  parameters {
    string(name: "BRANCH", defaultValue: "development", description: "What branch/tag do you want to run?")
    choice(name: "DEPLOYMENT_TYPE", choices: ["branch", "tag"], description: "Type of deployment?")
  }
  stages {
    stage("Build") {
      steps {
        sh "npm --version"
      }
    }
    stage("Deploy") {
       steps {
         sshagent(credentials: ["jenkins"]) {
           sh "ssh -o StrictHostKeyChecking=no -l root 165.227.254.52 sh /root/backend/ofb-backend-trivia-up.sh ${params.DEPLOYMENT_TYPE} ${params.BRANCH}"
           sh "ssh -o StrictHostKeyChecking=no -l root 165.227.254.52 sh /root/docker/start.sh"
         }
       }
    }
  }
}