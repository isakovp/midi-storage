FROM node:lts-alpine

RUN apk add git
# устанавливаем простой HTTP-сервер для статики
RUN npm install -g http-server

# делаем каталог 'app' текущим рабочим каталогом
WORKDIR /app
RUN mkdir -p /app/uploads
# копируем оба 'package.json' и 'package-lock.json' (если есть)
COPY package.json ./
COPY yarn.lock ./

# устанавливаем зависимости проекта
RUN yarn install

# копируем файлы и каталоги проекта в текущий рабочий каталог (т.е. в каталог 'app')
COPY . .

# собираем приложение для production с минификацией
RUN yarn build

EXPOSE 8080
CMD [ "http-server", "-P http://localhost:8080?", "dist" ]
