#!/usr/bin/env bash
#please run as root/sudo
# reboot once after installing to take effect for cgroups and containers

cd ~

# set cap to nsenter,gcc,g++
# sudo setcap "cap_sys_admin,cap_sys_ptrace+ep" /usr/bin/nsenter && ./containers-from-scratch/main run 2 nsenter -n -t$$ /bin/bash
# sudo setcap "cap_sys_admin,cap_sys_ptrace+ep" /usr/bin/arm-linux-gnueabihf-gcc-8

#install golang
apt install golang

#install npm
apt install npm
npm install npm@latest -g

#install cling
#use following to compile minimal cling
#/usr/bin/ld.gold --strip-all --no-map-whole-files --no-keep-memory --no-keep-files-mapped $@ 
# cling takes some time to init first instance, add below lines to rc.local(startup)
#/usr/bin/cling 21321 .q > /dev/null 2>&1 &

#install gointerpreter
git clone https://github.com/vickeykumar/Go-interpreter.git
cd Go-interpreter
make install
cd ..

#install ipython2.7
apt install ipython

#install ipython3
apt install ipython3

#install Ruby(irb)
apt install ruby

#install nodejs
apt install nodejs

#install perli
apt install rlwrap
apt install perl
apt install perl-doc
git clone https://github.com/vickeykumar/perli.git
cd perli && make install
cd ~




