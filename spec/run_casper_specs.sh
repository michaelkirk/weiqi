#!/bin/bash

# Run from the make file, e.g. `spec/..`

export PATH=spec/vendor/casperjs/bin:$PATH
export PATH=spec/vendor/phantomjs-1.7.0-linux-i686/bin:$PATH

# extend the test runner if needed https://github.com/n1k0/casperjs/issues/44
casperjs spec/acceptance/board_features.casper.js

