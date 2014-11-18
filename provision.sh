#!/bin/sh

sudo apt-get update
sudo apt-get dist-upgrade -y
echo 'mysql-server mysql-server/root_password password appserver' | sudo debconf-set-selections
echo 'mysql-server mysql-server/root_password_again password appserver' | sudo debconf-set-selections
sudo apt-get -y install mysql-server git-core curl build-essential openssl libssl-dev
sudo chown -R $USER /usr/local
cd
git clone https://github.com/joyent/node.git
cd node
git checkout v0.10.33
./configure
make
make install
cd
git clone https://github.com/npm/npm.git
cd npm
git checkout v1.4.28
./configure
make
make install
cd
npm install -g strongloop
