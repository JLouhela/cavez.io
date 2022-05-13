# cavez.io
Multiplayer browser cave flying game

Currently contains very immature framework of
- Server side + client side physics (no proper corrective actions + latency handling)
- Basic rendering of ship + background, no levels yet
- Geckos.io sockets (WebRTC) with default configuration, only works on chrome?
- Support for multiple connections (immature interpolation)

Unfortunately I'm a bit stuck deploying this on a server and I am not able to test the network behavior in real environment. WebRTC seems a bit frustrating from this point of view and the project is on hold until I find the time and strength to battle it.


# Install instructions

## Development


make setup
make dev

Head to http://0.0.0.0:1234


## Production

make prod

Head to http://0.0.0.0:1234