## Build ##
```
docker build -t matching_fe .
docker save -o matching_fe.tar matching_fe
gzip matching_fe.tar
scp -P 56929 matching_fe.tar.gz root@62.60.246.253:.
rm matching_fe.tar.gz
```

## Deploy ##
```
ssh root@62.60.246.253 -p 56929
docker stop matching_fe
docker rmi matching_fe
gunzip matching_fe.tar.gz
docker load -i matching_fe.tar
rm matching_fe.tar
docker run --rm -d --network exch --name matching_fe matching_fe
```
