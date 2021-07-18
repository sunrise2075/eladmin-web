# 处理依赖安装失败

  # 解析依赖树失败，需要增加命令行参数

    npm install --save --legacy-peer-deps

  # `Echarts`依赖重新安装

    npm uninstall echarts --save

    npm install echarts --save
