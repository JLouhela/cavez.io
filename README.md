# cavez.io
Multiplayer browser cave flying game

Currently contains very immature framework of
- Server side + client side physics (no proper corrective actions + latency handling)
- Basic rendering of ship + background, no levels yet
- Geckos.io sockets (WebRTC) with default configuration, only works on chrome?
- Support for multiple connections (immature interpolation)

# Live deployment

This may or may not work, depending on the server status and certificates: http://cavez.jlouhela.com:1234/


# Install instructions

## Development


make setup
make dev

Head to http://0.0.0.0:1234


## Production

make prod

Head to http://0.0.0.0:1234
