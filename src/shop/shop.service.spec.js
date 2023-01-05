jest.mock("axios");
const axios = require("axios");
//haget get all tickets
const shopService = require("./shop.service");
const mockTicketsApiStub = require("./tickets.api.stub.json");
//haget patch
const patchService = require("./patch.service");
const mockPendingApiStub = require("./patch.api.stub.json");
//haget post
const mockShopApiStub = require("./shop.api.stub.json");
const masterlistService = require("./masterlist.service");

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe("Test Shop API", () => {
  test("Test get masterlist", async () => {
    const shop = axios.get.mockResolvedValueOnce(mockTicketsApiStub);
    const results = await shopService.getTickets(shop);
    expect(results).toEqual(mockTicketsApiStub.data);
  });
});

describe("Test patch ", () => {
  test("Expected Shop Response", async () => {
    const ticket = axios.patch.mockResolvedValueOnce(mockPendingApiStub);
    const results = await patchService.patchPendingTicket(ticket);
    expect(results).toEqual(mockPendingApiStub.data);
  });
});

describe("Test post ", () => {
  test("Expected Shop Response", async () => {
    const ticket = axios.post.mockResolvedValueOnce(mockShopApiStub);
    const results = await masterlistService.patchPendingTicket(ticket);
    expect(results).toEqual(mockShopApiStub.data);
  });
});
