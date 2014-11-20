#!/bin/sh

echo "deb http://http.debian.net/debian wheezy-backports main" | sudo tee /etc/apt/sourcesvag   .list.d/backports.list
echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
sudo apt-get update
sudo apt-get dist-upgrade -y
echo 'mysql-server mysql-server/root_password password appserver' | sudo debconf-set-selections
echo 'mysql-server mysql-server/root_password_again password appserver' | sudo debconf-set-selections
sudo apt-get -y install git-core curl build-essential openssl libssl-dev mongodb-org
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
git checkout v2.1.8
./configure
make
make install
cd
npm install -g strongloop
echo "CREATE USER 'appserver'@'localhost' IDENTIFIED BY 'appserver';GRANT USAGE ON * . * TO 'appserver'@'localhost' IDENTIFIED BY 'appserver';CREATE DATABASE IF NOT EXISTS appserver;GRANT ALL PRIVILEGES ON appserver . * TO 'appserver'@'localhost';" | mysql -u root -pvagrant
