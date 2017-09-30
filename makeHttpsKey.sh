#!/bin/bash

sudo bash -c "openssl genrsa 1024 > key.pem"
sudo bash -c "openssl req -x509 -new -key key.pem > cert.pem"
