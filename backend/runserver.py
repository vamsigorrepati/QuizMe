"""Import necessary modules for runserver.py"""
import argparse
import sys

import mysql.connector
from app import app
from database import *

def main(port):

    try:
        port = int(port)
        if port < 0 or port > 65535:
            print(f"Port must be in range 0 - 65535. Given port: {port}. Please try another.", file = sys.stderr)
            sys.exit(1)
    except ValueError as ex:
        print(ex, file = sys.stderr)
        sys.exit(1)

    try:
        conn = mysql.connector.connect(user = DATABASE_USER, password = DATABASE_PWD,
                                       host = DATABASE_HOST, port = DATABASE_PORT,
                                       database = DATABASE_NAME)
        conn.close()
    except Exception as ex:
        print(ex, file = sys.stderr)
        sys.exit(1)

    try:
        app.run('0.0.0.0', port = port, debug = True)
    except (OSError, SystemExit) as ex:
        print(ex, file = sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description = 'The Quizme application', allow_abbrev = False)

    parser.add_argument("port", type = int, help = "the port at which the server is listening")

    args = parser.parse_args()

    main(args.port)
