#!/bin/sh

echo "deb http://http.debian.net/debian wheezy-backports main" | sudo tee /etc/apt/sources.list.d/backports.list
sudo apt-get update
sudo apt-get dist-upgrade -y
echo 'mysql-server mysql-server/root_password password appserver' | sudo debconf-set-selections
echo 'mysql-server mysql-server/root_password_again password appserver' | sudo debconf-set-selections
sudo apt-get -y install git-core curl build-essential openssl libssl-dev
sudo apt-get -y -t wheezy-backports install mongodb
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs
sudo npm install -g strongloop
sudo npm install -g forever
echo "CREATE USER 'appserver'@'localhost' IDENTIFIED BY 'appserver';GRANT USAGE ON * . * TO 'appserver'@'localhost' IDENTIFIED BY 'appserver';CREATE DATABASE IF NOT EXISTS appserver;GRANT ALL PRIVILEGES ON appserver . * TO 'appserver'@'localhost';" | mysql -u root -pvagrant
sudo cp /vagrant/vagrant-configs/default /etc/apache2/sites-available/default
#sudo cp /vagrant/vagrant-configs/phpmyadmin-secure.conf /etc/apache2/conf.d/phpmyadmin-secure.conf
sudo a2enmod proxy_http
sudo service apache2 restart
