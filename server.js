const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')
const admin = require('firebase-admin')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const cert = {
  type: "service_account",
  project_id: process.env.SERVER_FIREBASE_PROJECT_ID,
  private_key_id: process.env.SERVER_FIREBASE_PRIVATE_KEY_ID,
  private_key: Buffer.from(process.env.SERVER_FIREBASE_PRIVATE_KEY_BASE64, 'base64').toString(),
  client_email: process.env.SERVER_FIREBASE_CLIENT_EMAIL,
  client_id: process.env.SERVER_FIREBASE_CLIENT_ID,
  auth_uri: process.env.SERVER_FIREBASE_AUTH_URI,
  token_uri: process.env.SERVER_FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.SERVER_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.SERVER_FIREBASE_CLIENT_X509_CERT_URL
}

const firebase = admin.initializeApp(
  {
    credential: admin.credential.cert(cert),
  },
  'server'
)

app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.json())

  server.use((req, res, next) => {
    req.firebaseServer = firebase
    next()
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})