#!/bin/bash 

# IP or URL of the server you want to deploy to
export APP_HOST=localhost:3000
# export EC2_PEM_FILE=path/to/your/file.pem

export APP_NAME=$APP_HOST
export ROOT_URL=http://$APP_HOST
export APP_DIR=/var/www/$APP_NAME
export PORT=3000
export MONGO_URL='mongodb://travel:e8b19da37825a3056e84c522f05efce9@paulo.mongohq.com:10062/meteortravel'
export SSH_OPT=''
export SSH_HOST=$APP_HOST

if [ -z "$EC2_PEM_FILE" ]; then
    export SSH_HOST="root@$APP_HOST" SSH_OPT=""
  else
    export SSH_HOST="ubuntu@$APP_HOST" SSH_OPT="-i $EC2_PEM_FILE"
fi

if [ -d ".meteor/meteorite" ]; then
    export METEOR_CMD=mrt
  else
    export METEOR_CMD=meteor
fi

case "$1" in
  run )
  echo launching meteor
  MONGO_URL=$MONGO_URL mrt
  ;;
  setup )
  echo preping the server
  ssh $SSH_OPT $SSH_HOST DEBIAN_FRONTEND=noninteractive 'sudo -E bash -s' > /dev/null 2>&1 <<'ENDSSH'
apt-get update
apt-get install -y python-software-properties
add-apt-repository ppa:chris-lea/node.js-legacy
apt-get update
npm install -g forever
ENDSSH
  echo Done. You can now deploy your app.
  ;;
build-run )
  #v0.10.10 is possible
  #v0.8.14 is safe
  rm -fr demeteorized &&
  demeteorizer -n v0.8.14 -o demeteorized &&
  cd demeteorized &&
  sed 's/-meteor",/",/g' package.json > package.json.new &&
  mv package.json package.json.orig &&
  mv package.json.new package.json &&
  npm install &&
  npm shrinkwrap &&
  echo "demeteorized node package is set up" &&
  export ROOT_URL=http://localhost &&
  node main.js &&
  echo "application running on $ROOT_URL:$PORT"
  ;;
build-clean )
  rm -fr demeteorized
  ;;
deploy )
  echo Deploying with $METEOR_CMD

  $METEOR_CMD bundle bundle.tgz --production &&
  scp $SSH_OPT bundle.tgz $SSH_HOST:/tmp/  &&
  rm bundle.tgz > /dev/null 2>&1 &&
  ssh $SSH_OPT $SSH_HOST MONGO_URL=$MONGO_URL ROOT_URL=$ROOT_URL APP_DIR=$APP_DIR 'sudo -E bash -s' > /dev/null 2>&1 <<'ENDSSH'
if [ ! -d "$APP_DIR" ]; then
mkdir -p $APP_DIR
chown -R www-data:www-data $APP_DIR
fi
pushd $APP_DIR
forever stopall
forever stop bundle/main.js
rm -rf bundle
tar xfz /tmp/bundle.tgz -C $APP_DIR
rm /tmp/bundle.tgz
pushd bundle/server/node_modules
rm -rf fibers
( cd $APP_DIR/bundle/server && npm install fibers@1.0.0 )
popd
chown -R www-data:www-data bundle
patch -u bundle/server/server.js <<'ENDPATCH'
@@ -286,6 +286,8 @@
     app.listen(port, function() {
       if (argv.keepalive)
         console.log("LISTENING"); // must match run.js
+      process.setgid('www-data');
+      process.setuid('www-data');
     });
 
   }).run();
ENDPATCH
MONGO_URL=$MONGO_URL ROOT_URL=$ROOT_URL APP_DIR=$APP_DIR PORT=81 forever start bundle/main.js PORT=81
MONGO_URL=$MONGO_URL ROOT_URL=$ROOT_URL APP_DIR=$APP_DIR PORT=82 forever start bundle/main.js PORT=82
popd
ENDSSH
  echo app deployed and live on: $ROOT_URL
  echo debug: ran MONGO_URL=$MONGO_URL ROOT_URL=$ROOT_URL APP_DIR=$APP_DIR PORT=81 forever start bundle/main.js PORT=81
  ;;
* )
  cat <<'ENDCAT'
  ./meteor.sh [action]

  Available actions:

  run     - Run this Meteor project
  setup   - Install a Meteor env on Ubuntu metal
  deploy  - Deploy to server
ENDCAT
  ;;
esac
