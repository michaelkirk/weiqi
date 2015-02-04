Weiqi
=====
                   _       _ 
     __      _____(_) __ _(_)
     \ \ /\ / / _ \ |/ _` | |
      \ V  V /  __/ | (_| | |
       \_/\_/ \___|_|\__, |_|
                        |_|  


Installation
============

Prerequisites
-------------

### node & nvm
    # install nvm: https://github.com/creationix/nvm
    $> nvm install 0.8
    $> nvm use 0.8

### npm
    $> curl http://npmjs.org/install.sh | sudo sh

### Redis
    $> sudo apt-get install redis-server


Vagrant
-------

As an alternative to the above steps you can use vagrant. Make sure
an up-to-date vagrant and chef-dk are installed and run the folowing commands:

    $> vagrant plugin install vagrant-berkshelf
    $> vagrant plugin install vagrant-omnibus

Lastly, bring the box up and provision it:

    $> vagrant up


Install WeiQi
-------------

    $> git clone git@github.com:michaelkirk/weiqi.git && cd weiqi
    $> npm install
    $> sudo npm install supervisor -g
    $> make server


Tests
=====
To run the client specs, point your browser to: file://&lt;project directory&gt;/spec/jasmine/SpecRunner.html

    $> make server &

To run the acceptance suite
    $> npm install -g mocha
    $> make test

Deployment
==========
Add heroku to your git remotes once

    $> git remote add heroku git@heroku.com:evening-meadow-5281.git

To deploy, push your branch to heroku

    $> git pull # make sure you're up to date
    $> git push heroku


