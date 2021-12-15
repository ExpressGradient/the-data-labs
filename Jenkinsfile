pipeline {
  agent any
  stages {
    stage("running frontend and backend") {
      steps {
        echo "executing npm..."
        nodejs("Node") {
          sh "sudo npm install"
          sh "sudo npm run build"
        }
      }
    }
  }
}
