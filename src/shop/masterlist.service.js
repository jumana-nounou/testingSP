const api = require("axios");

const SHOP_INFO = "https://shopmicroservice-wblx.vercel.app/api";
async function postMasterList() {
  return api.post(`${SHOP_INFO}/masterlist`).catch((e) => null);
}
module.exports = {
  postMasterList,
};
