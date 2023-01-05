const api = require("axios");

const SHOP_INFO = "https://shopmicroservice-wblx.vercel.app/api";

function getTickets() {
  return api
    .get(`${SHOP_INFO}/allTickets`)
    .then(({ data }) => data)
    .catch((e) => null);
}

module.exports = {
  getTickets,
};
