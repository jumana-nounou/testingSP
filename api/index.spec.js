const request = require("supertest");
const main = require("./index");
//haget el get all tickets
const { getTickets } = require("../src/shop/shop.service");
const mockTicketsApiStub = require("../src/shop/tickets.api.stub.json");
//haget patch
const { patchPendingTicket } = require("../src/shop/patch.service");
const mockPendingApiStub = require("../src/shop/patch.api.stub.json");
// haget masterlist post
const { postMasterList } = require("../src/shop/masterlist.service");
const mockShopApiStub = require("../src/shop/shop.api.stub.json");

//
const BASE_URL = "http://localhost:3000/api";

// Mocks the weather service for all tests in this file
jest.mock("../src/shop/shop.service", () => ({
  getTickets: jest.fn(() => mockTicketsApiStub.data),
}));

// Mocks the country service for all tests in this file
jest.mock("../src/shop/masterlist.service", () => ({
  postMasterList: jest.fn((data) => mockShopApiStub.data),
}));

jest.mock("../src/shop/patch.service", () => ({
  patchPendingTicket: jest.fn(() => mockPendingApiStub),
}));

describe("Tickets", () => {
  // get All Tickets Endpoint
  test("Get Shop Response", async () => {
    const response = await request(BASE_URL).get("/allTickets");
    console.log("response", response.body);
    expect(response.body).toEqual(mockTicketsApiStub.data);
    expect(getTickets).toHaveBeenCalled();
  });

  test("No shop Response", async () => {
    getTickets.mockImplementationOnce(() => null);
    const response = await request(BASE_URL).get("/allTickets");
    expect(response.error.text).toContain("Could not process request");
  });
});

// describe("Patch status ttttttttt", () => {
//   test("Expected Shop Responseaaaaaaaaa", async () => {
//     const response = await request(BASE_URL).patch("/pendingTicket/96/2/2");
//     expect(response.body).toEqual(mockPendingApiStub.data);
//     expect(patchPendingTicket).toHaveBeenCalled();
//   });

//   //   test("Incorrect shop Arguments", async () => {
//   //     const response = await request(BASE_URL).patch("/pendingTicket/96/2/2");
//   //     console.log();
//   //     expect(response.data).toEqual(mockPendingApiStub.data.acknowledged);
//   //   });

//   //   test("No shop Response", async () => {
//   //     patchPending.mockImplementationOnce(() => null);
//   //     const response = await request(BASE_URL).patch("/pendingTicket/96/1/2");
//   //     expect(response.error.text).toContain("Could not process request");
//   //   });
// });

// describe("masterlist", () => {
//   // Shop Endpoint
//   test("Expected masterlist Response", async (data) => {
//     const response = await request(BASE_URL).post("/masterlist", data);
//     expect(response.body).toEqual(mockShopApiStub);
//     console.log(response);
//     expect(postMasterList).toHaveBeenCalled();
//   });

//   // test("Incorrect shop Arguments", async () => {
//   //   const response = await request(BASE_URL).get("/masterlist");
//   //   expect(response.error.text).toContain("Expected city argument");
//   // });

//   test("No masterlist Response", async () => {
//     postMasterList.mockImplementationOnce(() => null);
//     const response = await request(BASE_URL).post("/masterlist");
//     expect(response.error.text).toContain("Could not process request");
//   });
// });
