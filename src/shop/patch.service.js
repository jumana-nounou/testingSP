const api = require("axios");

const SHOP_INFO = "https://shopmicroservice-wblx.vercel.app/api";
// function patchReserved(matchNumber, categoryNo, availability, pending) {
//   return api
//     .patch(
//       `${SHOP_INFO}/reservedTicket/${matchNumber}/${categoryNo}/${availability}/${pending}`
//     )
//     .then(({ data }) => data)
//     .catch((e) => null);
// }
// function patchCancelled(matchNumber, categoryNo, pending) {
//   return api
//     .patch(
//       `${SHOP_INFO}/cancelledTicket/${matchNumber}/${categoryNo}/${pending}`
//     )
//     .then(({ data }) => data)
//     .catch((e) => null);
// }
async function patchPendingTicket(matchNumber, categoryNo, pending) {
  return api
    .patch(`${SHOP_INFO}/pendingTicket/${matchNumber}/${categoryNo}/${pending}`)
    .then(({ data }) => data)
    .catch((e) => null);
}

module.exports = {
  patchPendingTicket,
  // patchCancelled,
  // patchReserved,
};
