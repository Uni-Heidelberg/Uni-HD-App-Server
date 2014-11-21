# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "chrko/debian-web"

  config.vm.network "forwarded_port", guest: 80, host: 8080, auto_correct: true

  config.vm.network "public_network"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 4096
    vb.cpus = 2
  end

  config.vm.provision "shell", inline: "apt-get update && apt-get dist-upgrade -y", run: "always"
  config.vm.provision "shell", path: "vagrant-configs/provision.sh", privileged: false
  config.vm.provision "shell",
        inline: "cd /vagrant; npm install; forever start server/server.js",
        run: "always", privileged: false
end
