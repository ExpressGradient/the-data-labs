pipeline {
  agent any
  environment {
    SUPABASE_URL = credentials('supabase-url')
    SUPABASE_KEY = credentials('supabase-key')
    AUTH0_SECRET = credentials('auth0-secret')
    AUTH0_BASE_URL = credentials('auth0-base-url')
    AUTH0_ISSUER_BASE_URL = credentials('auth0-issuer-base-url')
    AUTH0_CLIENT_ID = credentials('auth0-client-id')
    AUTH0_CLIENT_SECRET = credentials('auth0-client-secret')
    EMAIL_INFORM = 'kolavennu.sriganesh18@st.niituniversity.in'
  }
  stages {
    stage("Building...") {
      steps {
        echo "<----------Installing dependencies---------->"
        nodejs("Node") {
          sh "npm install"
          echo "Hello"
          echo "<----------Building application---------->"
          sh "npm run build"
        }
      }
    }
  }
  post {
    always {
      emailext body: 'Build was successful', to: "${EMAIL_INFORM}", subject: 'The Data Labs pipeline'
    }
  }
}