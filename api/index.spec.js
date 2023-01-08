const request = require("supertest");
const main = require("./index");
const axios = require("axios");
jest.mock("axios");

//haget el get all tickets
const mockTicketsApiStub = require("../src/shop/tickets.api.stub.json");
//haget patch
const { patchPendingTicket } = require("../src/shop/patch.service");
const mockPendingApiStub = require("../src/shop/patch.api.stub.json");
// haget masterlist post
const mockMatchApiStub = require("../src/shop/match.api.stub.json");

//
const BASE_URL = "https://shopmicroservice-wblx.vercel.app";
beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});
describe("Tickets", () => {
  // get All Tickets Endpoint
  test("Get All tickets", async () => {
    const response = await request(BASE_URL).get("/api/allTickets");
    expect(response.statusCode).toEqual(200);
  });

  test("post a match", async () => {
    const matchStub = {
      matchNumber: 96,
      roundNumber: 2,
      dateUtc: "2022-11-20T00:00:00.000+00:00",
      location: "Mannonies house",
      availability: {
        category1: {
          available: 5,
          pending: 2,
          price: 75,
        },
        category2: {
          available: 10,
          pending: 5,
          price: 100,
        },
        category3: {
          available: 87,
          pending: 44,
          price: 125,
        },
      },
      homeTeam: "Qatar",
      awayTeam: "Egypt",
      group: "A",
    };
    const response = await request(BASE_URL)
      .post("/api/masterlist")
      .send(matchStub);
    //console.log("matchhhh", response.body);
    expect(response.statusCode).toEqual(200);
    //  expect(response.body).toEqual(mockMatchApiStub);
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
