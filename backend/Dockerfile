# syntax=docker/dockerfile:1
FROM ubuntu:latest
USER root

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update  -y
RUN apt-get upgrade -y

RUN apt-get install -y git
RUN apt-get install -y curl
RUN curl -fsLS https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y abcmidi

RUN npm install --global yarn

RUN node --version > version
RUN cat version

# делаем каталог 'app' текущим рабочим каталогом
WORKDIR /home/app

# копируем оба 'package.json' и 'package-lock.json' (если есть)
COPY package.json ./
COPY yarn.lock ./

# устанавливаем зависимости проекта
RUN yarn install

# копируем файлы и каталоги проекта в текущий рабочий каталог (т.е. в каталог 'app')
COPY . .

EXPOSE 3001
CMD [ "node", "run", "prod" ]
