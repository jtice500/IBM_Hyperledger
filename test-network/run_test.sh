#!/bin/bash


./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn fabcar -cci initLedger -ccl javascript -ccp ../chaincode/fabcar/javascript/
