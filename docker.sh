#!/bin/bash

set -e
cd /opt/docker/dev-itravel

# 复制 config
cp -r ./config ./www

# 构建 docker
cd ./www
sudo docker build -t dev-itravel .

# 停止并删除，当容器不存在时会报错，需要加以判断
if [ "$(docker ps -a -q -f name=^dev-itravel$)" ]; then
  sudo docker stop dev-itravel
  sudo docker rm dev-itravel
fi

# 运行
sudo bash /root/docker-script/docker-dev-itravel.sh
