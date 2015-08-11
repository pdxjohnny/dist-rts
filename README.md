Dist RTS
---

An attempt to use websockets to mircoserviceize an rts game

Ideas
---

Rather than setup mircoservices in the way I have seen before (with each having
their own port they are hosted on and then being connected to) This project
will explore their use through websockets. The idea is for the game to work
on any platform by providing the information needed to render assets.

This project is the evolution of [pdxjohnny/js-rts][js-rts] and will attempt
to distribute the heavy lifting and game logic of the rts game.

For example the Unit service will handle a certian number of units and if that
number is exceeded a new service will be launched to distribute the load.
> But how will it distribute the load if its all on one computer?????

It won't be! the beauty of using websockets to connect the mircoservices is that
users can run the swarm service and contribute their computing power! If we had
take the classic approch then the services would have to be exposed to any who
need to access them. That works great for a backend of a large system but
we need any computer to be able to connect to the game and contribute to running
it faster.

Outline
---

- Websocket server which sends messages to appropriate clients / mircoservices
- Go microservices to process the updates of game objects
  - Swarm service to mange number and types of services needed
  - Unit service
  - Construction service
- Javascript client to render game

Testing
---

To run tests the Websocket server must be up.

Docker
---

Running with Docker
```bash
./script/build
docker run -d -p 8081:8081 pdxjohnny/dist-rts
```

[js-rts]: https://github.com/pdxjohnny/js-rts
