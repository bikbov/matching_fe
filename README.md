## Build & Deploy ##
```
npm run build
ssh root@aeserver -p 56929
docker stop nginx
rm -r matching_fe
mkdir matching_fe
exit
```

```
scp -r -P 56929 build/* root@aeserver:./matching_fe/
ssh root@aeserver -p 56929
docker run --rm -p 443:443 -v $PWD/matching_fe:/var/www/ -v $PWD/nginx.conf:/etc/nginx/nginx.conf -v /etc/letsencrypt/live/alicebob.ru/privkey.pem:/etc/ssl/privkey.pem -v /etc/letsencrypt/live/alicebob.ru/fullchain.pem:/etc/ssl/fullchain.pem --name nginx -d --network exch nginx:alpine
```

todo:
```
css fix
```
