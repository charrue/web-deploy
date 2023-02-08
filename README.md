# Web Deploy


## 功能

### init-config
- 生成初始的配置文件

### update-config
- 更新`.web-deploy`下的配置文件

### init
- 如果当前文件夹下已存在该目录，则git clone
- 确认是否安装`ni`
- `ni`
- 将`web-deploy.json`保持到`.web-deploy/store.json`


### build

- 执行`npm run build`
- 进入`dist`目录将代码上传到`release`分支，并打上tag。

### release [NAME]
- 如果是第一次执行
  - `git clone REMOTE_URL -b release`
- 如果已经clone过了
  - `git fetch --all`
  - `git reset --hard origin/release`
  - `git pull origin release`

## list NAME
- 展示所有的发布版本

