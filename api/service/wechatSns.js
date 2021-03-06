import nconf from 'nconf';
import rp from 'request-promise';

const getToken = async code => {
  const url = `${nconf.get('wechat:baseUrl')}/sns/oauth2/accessToken?appid=${nconf.get('wechat:appId')}&secret=${nconf.get('wechat:appSecret')}&code=${code}&grant_type=authorization_code`;
  const res = await rp.get({ url, json: true });
  const body = res.body;
  if (!body.accessToken) {
    return Promise.reject(new Error(body.errcode + '/' + body.errmsg));
  }
  return body;
};

const getUserInfo = async (token, openid) => {
  const url = `${nconf.get('wechat:baseUrl')}/sns/userinfo?accessToken=${token}&openid=${openid}&lang=zh_CN`;
  const res = await rp.get({ url, json: true });
  const body = res.body;
  if (!body.openid) {
    return Promise.reject(new Error(body.errcode + '/' + body.errmsg));
  }
  return body;
};

export {
  getToken,
  getUserInfo
};
