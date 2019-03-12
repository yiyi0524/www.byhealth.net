#!/usr/bin/env bash

function defineConstants(){
    webRootPath="/var/www/www.byhealth.net"
    reactPath="${webRootPath}/react"
    buildPath="${reactPath}/build"
    publicPath="${webRootPath}/public"
    buildBakPath="${reactPath}/backup"
    if [ ! -d ${buildBakPath} ]; then
        mkdir -p ${buildBakPath} || (echo "创建备份目录失败";exit 1)
    fi
}

function checkIsBuilding(){
    if [ -e "${reactPath}/scripts/build.lock" ]; then
#    echo "当前正在构建中";
    return 0;
    fi
    return 1;
}
function writeBuildLockFile(){
    echo ''> "${reactPath}/scripts/build.lock"  || ( echo "写入lock文件失败"; exit 1 )
}

function unlinkBuildLockFile(){
    rm -f ${reactPath}/scripts/build.lock
}

function rollback(){
    echo "$1"
    checkIsBuilding && unlinkBuildLockFile
    exit 1
}
path=$PATH
if [ `whoami` != "buff" ]; then
    su buff -c  "`pwd`/${0} ${path} ${*}"
    exit $?
fi
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/usr/local/go/bin:/home/buff/projects/go/bin:/usr/local/nodejs/bin
defineConstants
cd ${reactPath}
checkIsBuilding &&  echo "当前正在构建中... 请稍候" &&  exit 1
echo "开始构建"
REACT_APP_BUILD_TIME=`date +"%Y-%m-%d %H:%M:%S"`
sed -i "s/REACT_APP_BUILD_TIME=[^\n]*/REACT_APP_BUILD_TIME=${REACT_APP_BUILD_TIME}/" .env
writeBuildLockFile
yarn && yarn build || rollback "构建失败"

cat "${webRootPath}/react/build/index.html" > "${webRootPath}/app/index/view/index/index.phtml" \
|| rollback "写入index.phtml失败"
cp -r "./build/static" "${webRootPath}/public/static-temp"\
|| rollback "写入static-temp失败"
rm -rf "${webRootPath}/public/static" && mv "${webRootPath}/public/static-temp" "${webRootPath}/public/static"\
|| rollback "写入static失败"
cat "${webRootPath}/react/build/manifest.json" > "${webRootPath}/public/manifest.json"\
|| rollback "写入manifest.json失败"
cat "${webRootPath}/react/build/favicon.ico" > "${webRootPath}/public/favicon.ico"\
|| rollback "写入favicon.ico失败"
unlinkBuildLockFile && echo "build Success" && exit 0
rollback "删除锁文件失败"




