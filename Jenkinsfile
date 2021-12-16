pipeline {
  agent any
  environment {
    SUPABASE_URL = credentials('supabase-url')
    SUPABASE_KEY = credentials('supabase-key ')
  }
  stages {
    stage("running frontend and backend") {
      steps {
        echo "Installing dependencies..."
        echo "Building the Project..."
        nodejs("Node") {
          sh "npm install"
          sh "npm run build"
        }
      }
    }
  }
}
