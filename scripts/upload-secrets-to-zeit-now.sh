#!/bin/bash

source .env

now secrets add server_session_secret "$SERVER_SESSION_SECRET"

now secrets add server_firebase_project_id "$SERVER_FIREBASE_PROJECT_ID"
now secrets add server_firebase_private_key_id "$SERVER_FIREBASE_PRIVATE_KEY_ID"
now secrets add server_firebase_private_key_base64 "$SERVER_FIREBASE_PRIVATE_KEY_BASE64"
now secrets add server_firebase_client_email "$SERVER_FIREBASE_CLIENT_EMAIL"
now secrets add server_firebase_client_id "$SERVER_FIREBASE_CLIENT_ID"
now secrets add server_firebase_auth_uri "$SERVER_FIREBASE_AUTH_URI"
now secrets add server_firebase_token_uri "$SERVER_FIREBASE_TOKEN_URI"
now secrets add server_firebase_auth_provider_x509_cert_url "$SERVER_FIREBASE_AUTH_PROVIDER_X509_CERT_URL"
now secrets add server_firebase_client_x509_cert_url "$SERVER_FIREBASE_CLIENT_X509_CERT_URL"

now secrets add client_firebase_api_key "$CLIENT_FIREBASE_API_KEY"
now secrets add client_firebase_auth_domain "$CLIENT_FIREBASE_AUTH_DOMAIN"
now secrets add client_firebase_database_url "$CLIENT_FIREBASE_DATABASE_URL"
now secrets add client_firebase_project_id "$CLIENT_FIREBASE_PROJECT_ID"
now secrets add client_firebase_storage_bucket "$CLIENT_FIREBASE_STORAGE_BUCKET"
now secrets add client_firebase_messaging_sender_id "$CLIENT_FIREBASE_MESSAGING_SENDER_ID"
now secrets add client_firebase_app_id "$CLIENT_FIREBASE_APP_ID"
