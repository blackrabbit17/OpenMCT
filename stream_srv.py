import asyncio
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError
import json

# The set of clients connected to this server. It is used to distribute
# messages.
clients = {}  #: {websocket: name}

@asyncio.coroutine
def client_handler(websocket, path):
    print('New client', websocket)
    print(' ({} existing clients)'.format(len(clients)))

    try:
        # The first line from the client is the name
        name = yield from websocket.recv()

        try:
            payload = json.loads(name)
        except json.JSONDecodeError:
            print('JSONDecode error')
            return

        clients[websocket] = payload['client']
        print(websocket, payload['client'], 'added')
        for client, n in clients.items():
            print('Broadcast to ', n)
            yield from client.send(name)

        # Handle messages from this client
        while True:
            message = yield from websocket.recv()
            if message is None:
                their_name = clients[websocket]
                del clients[websocket]
                print('Client closed connection', websocket)
                for client, _ in clients.items():
                    yield from client.send(their_name + ' has left the chat')
                break

            # Send message to all clients
            for client, _ in clients.items():
                yield from client.send('{}: {}'.format(name, message))
    except (ConnectionClosedOK, ConnectionClosedError):
        print('Connection closed OK')
        if websocket in clients.keys():
            del clients[websocket]
