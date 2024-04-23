#!/usr/bin/env bash
echo "the root directory is ${ROOT_DIR}."
npm install  &&  npm run build || echo "could not build the vue.js application. "
mkdir -p ${ROOT_DIR}/build/public
cp $ROOT_DIR/.github/workflows/nginx-buildpack-config/* ${ROOT_DIR}/build
cp -r $ROOT_DIR/dist/* ${ROOT_DIR}/build/public
cd "$ROOT_DIR/build"
pack build $IMAGE_NAME --builder paketobuildpacks/builder:full --buildpack gcr.io/paketo-buildpacks/nginx:latest  --env PORT=8080
docker push $IMAGE_NAME
