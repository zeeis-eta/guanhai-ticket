## 本地调试
下载代码在本地调试，请参考[微信云托管本地调试指南](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/src/guide/debug/)

## 实时开发
代码变动时，不需要重新构建和启动容器，即可查看变动后的效果。请参考[微信云托管实时开发指南](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/src/guide/debug/dev.html)

## Dockerfile最佳实践
请参考[如何提高项目构建效率](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/src/scene/build/speed.html)

## 项目结构说明

```
.
├── Dockerfile
├── README.md
├── container.config.json
├── db.js
├── index.js
├── index.html
├── package.json
```

- `index.js`：项目入口，实现主要的读写 API
- `db.js`：数据库相关实现，使用 `sequelize` 作为 ORM
- `index.html`：首页代码
- `package.json`：Node.js 项目定义文件
- `container.config.json`：模板部署「服务设置」初始化配置（二开请忽略）
- `Dockerfile`：容器配置文件

## 服务 API 文档

### `POST /guanhai_ticket`

#### 请求参数

expire_seconds: int
scene_str: string
#### 响应结果

- `code`：错误码
- `data`：当前计数值

##### 响应结果示例

```json
{
  "ticket": xxxxx,
  "expire_seconds": xx,
  "url": "http://xxxx",
}
```

## vscode插件
- Weixin Cloudbase Docker Extension  
安装之后，在设置中搜索"wxcloud", 设置Appid和CLI key  

## Ubuntu安装Docker
```bash
sudo apt update
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo docker run hello-world
```
## 权限问题(docker报错：ERROR: Got permission denied)
- 第一次切换到root  
`sudo passwd root`
- su root
```bash
phong@phong-virtual-machine:~/Desktop/express-ticket$ su root
Password:
root@phong-virtual-machine:/home/phong/Desktop/express-ticket# sudo groupadd docker
groupadd: group 'docker' already exists
root@phong-virtual-machine:/home/phong/Desktop/express-ticket# sudo gpasswd -a phong docker
Adding user phong to group docker
root@phong-virtual-machine:/home/phong/Desktop/express-ticket# newgrp docker
root@phong-virtual-machine:/home/phong/Desktop/express-ticket# su phong
phong@phong-virtual-machine:~/Desktop/express-ticket$ docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
phong@phong-virtual-machine:~/Desktop/express-ticket$
```
- 重启Ubuntu

## 启动Proxy nodes for VPC access
启动api.weixin.qq.com容器
```bash
Executing task: docker run  --rm -d --network wxcb0 --name api.weixin.qq.com --pull=always -e TOAL_ROLE=client -e TOAL_SERVER=https://wxcloud-localdebug-proxy-68063-4-1320492701.sh.run.tcloudbase.com:443 -e TOAL_KEY=TOAL_j8h4uqhl5m -e TOAL_SERVER_TIMEOUT=200 -e TOAL_MODE=shortpoll -e TOAL_LOCAL_PORT=80 -e TOAL_TARGET=api.weixin.qq.com -e TOAL_VERBOSE=DEBUG -l role=vpcdebugproxy -l wxcloud=api.weixin.qq.com -l domain=api.weixin.qq.com ccr.ccs.tencentyun.com/tcb_prd/wxcloud-localdebug-proxy:latest 
```
## 将项目打包成容器
```bash
phong@phong-virtual-machine:~/Desktop/express-ticket$ docker run --rm --network wxcb0 -p 8080:80 -it -v /home/phong/Desktop/express-ticket:/app alpine:3.13 /bin/sh
/ # cd app
/app # ls
Dockerfile             README.md              db.js                  index.js
LICENSE                container.config.json  index.html             package.json
```
## 安装Dockerfile中的命令，安装依赖，运行
```bash
sed -i 's/dl-cdn.alpinelinux.org/mirrors.tencent.com/g' /etc/apk/repositories \
apk add --update --no-cache nodejs npm
npm install
npm start
```
## 访问8080端口的ticket接口
http://Linux的IP地址:8080/ticket
返回：
```json
{
    "ticket": "xxx",
    "expire_seconds": xxx,
    "url": "http://weixin.qq.com/q/xxx"
}
```
