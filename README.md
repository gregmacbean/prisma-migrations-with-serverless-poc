How to find the IP for the database container?
- `docker inspect pg_container | grep IPAddress`
- `ipconfig getifaddr en0`

How to invoke handler locally?
- `sls invoke local --function handler  --data '{"command":"get"}'`