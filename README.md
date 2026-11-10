# MyProxy 个人版

单人管理员、单份 Mihomo YAML、固定订阅 URL。编辑配置不会改变订阅链接。

## EdgeOne Pages 构建设置
- 框架预设：Other
- 根目录：`./`
- 输出目录：`.`
- 构建命令：留空
- 安装命令：留空

## 必需配置
1. 在 EdgeOne Pages 可用的 KV 服务中创建命名空间。
2. 将 KV 绑定到项目，绑定变量名必须为 `MYPROXY_KV`。
3. 在项目环境变量中设置 `ADMIN_PASSWORD`，使用强密码。
4. 将本仓库部署到 Pages。

代码通过 Pages Functions 的 `env.MYPROXY_KV` 读取 KV 绑定。请以控制台当前产品文档确认所用 KV 类型确实支持 Pages Functions 绑定；若控制台提供的绑定方式不同，需要按实际运行时调整代码。

## 使用
访问网站首页，使用 `ADMIN_PASSWORD` 登录。粘贴一份 Mihomo YAML 并保存。系统首次创建固定随机 Token，此后编辑配置不会更改订阅 URL。FlClash 中添加 `https://你的域名/sub/<token>`。

## 安全
订阅 URL 是秘密凭证，任何拿到链接的人都能读取配置。不要公开分享或提交 YAML、Token、管理员密码到 Git 仓库。此基础版尚未实现登录限速、审计、自动备份或 YAML 语法校验。请只保存你有权使用的配置。
