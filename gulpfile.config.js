/**
 * 远程服务器的配置文件
 * "gulp": "4.0.0",
 * "gulp-ssh": "0.7.0",
 * https://www.jianshu.com/p/c30ff8592421
 */
const data = new Date();
const time =
  data.getFullYear() +
  '-' +
  (data.getMonth() + 1) +
  '-' +
  data.getDate() +
  '-' +
  data.getHours() +
  '-' +
  data.getMinutes();

// 对应测试环境的 dev test 文件夹
const ENV_LIST = [
  {
    envName: 'dev',
  },
  {
    envName: 'test',
  },
  {
    envName: 'outerDev',
  },
  {
    envName: 'outerTest',
  },
];
const argv = JSON.parse(process.env.npm_config_argv).original || process.argv;
console.log(argv);
const HOST_ENV = argv[1] ? argv[1].split(':')[1] : '';
//没有设置环境，则默认为第一个
const HOST_CONF = HOST_ENV ? ENV_LIST.find((item) => item.envName === HOST_ENV) : ENV_LIST[0];
console.log('=====打包环境====gulp');
console.log(HOST_CONF.envName);

let remotePath = '/usr/local/apps/k9/web/'; // 远程服务器的路径,结尾需要/
if (HOST_CONF.envName == 'dev' || HOST_CONF.envName == 'outerDev') {
  remotePath = remotePath + 'dev/';
} else {
  remotePath = remotePath + 'test/';
}
console.log('服务器路径==' + remotePath);

const projectName = 'k9-app'; // 远程项目的名称
const historyProjectName = '2020-12-20-16-32'; // 这个在回滚上一个版本的时候需要手动修改，滚动的版本号，例如：2019-4-17-20

const gulpConfig = {
  devServerSShConfig: {
    uploadFile: './dist/**',
    sshConfig: {
      remotePath: remotePath + projectName, // 远程网站地址,会自动新建projectName文件夹
      env: HOST_CONF.envName,
      ssh: {
        // 测试环境
        host: '172.16.121.137',
        port: 22,
        username: 'root',
        password: 'password',
      },
      commands: [
        // 删除现有文件
        // `rm -rf /root/nginx_szcg/website/zhifa/ dist` ( 1.删除项目目录 )
        'rm -rf ' + remotePath + projectName + '/*',
      ],
      backups: [
        // cd /root/nginx_szcg/website/zhifa/dist/  ( 2.进入项目目录 )
        'cd ' + remotePath + projectName + '/',
        // tar -zcvf /root/nginx_szcg/website/zhifa/dist-copy/2019-4-17-3-59.tar.gz  ( 3.压缩备份，不会自动创建备份目录 )
        'tar -zcvf ' + remotePath + projectName + '-copy/' + time + '.tar.gz *',
      ],
      rollback: [
        // tar -zxvf /root/nginx_szcg/website/zhifa/dist-copy/2019-4-17-3-59.tar.gz -C /root/nginx_szcg/website/zhifa/dist/（4.解压恢复）
        'tar -zxvf ' +
          remotePath +
          projectName +
          '-copy/' +
          historyProjectName +
          '.tar.gz -C ' +
          remotePath +
          projectName +
          '/',
      ],
      // 只有修改nginx服务器的配置文件才需要重启nginx
      reload: [
        // /usr/local/webserver/nginx/sbin/nginx -s stop ( nginx -s stop  OR  nginx -s reload OR nginx -s start)
        '/usr/local/nginx/sbin/nginx -s stop',
        // /usr/local/webserver/nginx/sbin/nginx -c /usr/local/webserver/nginx/conf/nginx.conf
        '/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf',
      ],
    },
  },

  proServerSShConfig: {},
};

module.exports = gulpConfig;
