const jimp = require("jimp");

exports.changeResizeAvatar = async (avatarUrl) => {
  const image = await jimp.read(`public/${avatarUrl}`);
  await image.resize(250, 250);
  await image.writeAsync(`public/${avatarUrl}`);
};
