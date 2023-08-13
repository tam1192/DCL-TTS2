FROM node:lts-alpine3.18 AS builder
ENV NODE_ENV=development

WORKDIR /app
COPY ["package.json", "package-lock.json", "main.js", "modules", "./"]

RUN apk --no-cache add python3 make gcc g++
RUN npm install --development

FROM node:lts-alpine3.18
ENV NODE_ENV=development
COPY --from=builder /app ./app

WORKDIR /app
COPY ["main.js", "modules", "./"]
RUN apk --no-cache add ffmpeg opus

ENTRYPOINT ["npm"]
CMD ["start"]