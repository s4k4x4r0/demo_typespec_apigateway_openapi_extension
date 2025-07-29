#!/bin/bash

set -euo pipefail

# 手軽に個人設定を読み込む方法を取っています。
if [ -f ./postCreateCommand.local.sh ]; then
    source ./postCreateCommand.local.sh
fi

npm install
