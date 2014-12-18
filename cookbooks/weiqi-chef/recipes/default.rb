#
# Cookbook Name:: weiqi-chef
# Recipe:: default
#
# Copyright (C) 2014 YOUR_NAME
#
# All rights reserved - Do Not Redistribute
#

# udpate our apt-cache
include_recipe 'apt::default'

# utf8 en-US is the default
include_recipe 'locale::default'

package "git"
package "vim"
package "curl"
package "ack-grep"
package "redis-server"


bash "install nvm" do
  user "vagrant"
  group "vagrant"
  code "git clone https://github.com/creationix/nvm.git /home/vagrant/.nvm && cd /home/vagrant/.nvm && git checkout `git describe --abbrev=0 --tags`"
  not_if "test -e /home/vagrant/.nvm/nvm.sh"
end

bash "setup nvm for interactive shells" do
  user "vagrant"
  code "echo 'source /home/vagrant/.nvm/nvm.sh' >> /home/vagrant/.bashrc"
  not_if "grep nvm.sh /home/vagrant/.bashrc"
end

bash "install node versions" do
  user "vagrant"
  code "source /home/vagrant/.nvm/nvm.sh && nvm install 0.8"
  not_if "source /home/vagrant/.nvm/nvm.sh && nvm list | grep 0.8"
end

bash "use 0.8 node by default" do
  user "vagrant"
  code "echo 'nvm use 0.8' >> /home/vagrant/.bashrc"
  not_if "grep 'nvm use 0.8' /home/vagrant/.bashrc"
end

