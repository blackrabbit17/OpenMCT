#!/usr/bin/env python3
import asyncio
from http.server import HTTPServer, SimpleHTTPRequestHandler, test
from stream_srv import client_handler
import sys
import websockets

WS_SERVER = ('0.0.0.0', 9998)
HTTP_SERVER = 9999


class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)


if __name__ == '__main__':
    print('HTTP_SERVER', HTTP_SERVER)
    print('WEBS_SERVER', WS_SERVER)

    start_server = websockets.serve(client_handler, *WS_SERVER)
    asyncio.get_event_loop().run_until_complete(start_server)

    test(CORSRequestHandler, HTTPServer, port=int(sys.argv[1]) if len(sys.argv) > 1 else HTTP_SERVER)
    asyncio.get_event_loop().run_forever()
