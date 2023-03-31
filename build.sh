#!/bin/sh

npm run build && cat komf.meta.js dist/assets/index* >| komf.user.js

