FROM alpine:3.16.2

RUN apk add --update nodejs npm yt-dlp
RUN rm -rf /var/cache/apk/*

RUN mkdir /app
WORKDIR /app

COPY . .

RUN \
  cd /app && \
  npm ci

RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
