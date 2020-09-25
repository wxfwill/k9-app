let apiUrl = "";
// let address = { domains:'http://172.17.5.117:8080'};
// let address = { domains: 'http://172.17.5.239:8080' };
let address = { domains: "http://172.16.121.137:8080" }; //接口地址
//let address = {domains:'https://k9app.hcfdev.cn'};
//let address = { domains:'http://172.17.5.106:8080'};
// let ws = { host :'172.17.5.106:8080'};
let ws = "ws://172.16.121.137:8080"; //{ host :'172.17.5.234:8080'};
//let ws = 'wss://k9app.hcfdev.cn';
process.env.NODE_ENV == "development" ? (apiUrl = "") : (apiUrl = address.domains);
process.env.NODE_ENV == "development" ? "" : (ws = "wss://k9app.hcfdev.cn");
module.exports = {
  apiUrl: apiUrl,
  address,
  host: ws,
};
