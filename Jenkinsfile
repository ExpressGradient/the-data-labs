pipeline {
  agent any
  stages {
    stage("running frontend and backend") {
      steps {
        echo "executing npm..."
        nodejs("Node") {
          sh "npm install"
          sh "npm run build"
        }
      }
    }
  }
}
