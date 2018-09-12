'use strict';
import {
  dbFindAll, dbFindOne
} from '../service/dbtools';
import { filterWechatField } from '../service/album';

// 获取相册内容
const getAlbumBase = async ctx => {
  const albumId = ctx.params.albumId;
  let data = await dbFindOne('Albums', {
    where: { id: albumId }
  });
  if (data === null || data.expired_at <= Date.now()) {
    ctx.throw(400, '相册不存在或无法查看！');
  }
  let tags = await dbFindAll('Tags', {
    attributes: ['id', 'title'],
    where: { album_id: albumId },
    order: [['id', 'asc']]
  });

  data = filterWechatField(data, data.album_type);
  data.tags = tags;
  ctx.body = {
    code: 200,
    data
  };
};

const getAlbumImgs = async ctx => {
  const albumId = ctx.params.albumId;
  const imgs = await dbFindAll('Images', {
    attributes: ['id', 'tag_id', 'tiny_url', 'origin_url', 'des', 'size'],
    where: { album_id: albumId },
    order: [['upload_at', 'desc']]
  });
  ctx.body = {
    code: 200,
    data: imgs
  };
};

export {
  getAlbumBase,
  getAlbumImgs
};