pipeline {
  agent any
  environment {
    SUPABASE_URL = credentials('supabase-url')
    SUPABASE_KEY = credentials('supabase-key ')
  }
  stages {
    stage("running frontend and backend") {
      steps {
        echo "executing npm..."
        echo "getting url ${SUPABASE_URL}"
        echo "getting key ${SUPABASE_KEY}"
        nodejs("Node") {
          sh "npm install"
          sh "npm run build"
        }
      }
    }
  }
}
