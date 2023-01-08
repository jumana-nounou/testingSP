// const { MongoClient } = require("mongodb");
// const URI =
//   "mongodb+srv://singergy:NoorandMenna@cluster0.spx7d20.mongodb.net/?retryWrites=true&w=majority";

// jest.mock("./mongo");

// describe("insert", () => {
//   let connection;
//   let db;

//   beforeAll(async () => {
//     connection = await MongoClient.connect(URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     db = await connection.db("Fifa22");
//   });

//   afterAll(async () => {
//     await connection.close();
//   });

//   it("should insert a doc into collection", async () => {
//     const tickets = db.collection("Shop");

//     const mockTicket = {
//       matchNumber: 1,
//       roundNumber: 3,
//       dateUtc: "2022-11-20T00:00:00.000+00:00",
//       location: "Mannonies house",
//       availability: {
//         category1: {
//           available: 5,
//           pending: 2,
//           price: 75,
//         },
//         category2: {
//           available: 10,
//           pending: 5,
//           price: 100,
//         },
//         category3: {
//           available: 87,
//           pending: 44,
//           price: 125,
//         },
//       },
//       homeTeam: "Qatar",
//       awayTeam: "Egypt",
//       group: "A",
//     };
//     await tickets.insertOne(mockTicket);

//     const insertedTicket = await tickets.findOne({
//       matchNumber: 1,
//     });
//     expect(insertedTicket).toEqual(mockTicket);
//   });
// });

const { MongoClient } = require("mongodb");

describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(
      "mongodb+srv://singergy:NoorandMenna@cluster0.spx7d20.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    db = await connection.db("Fifa22");
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should insert a doc into collection", async () => {
    const shop = db.collection("Shop");

    const mockShop = { _id: "3", matchNumber: 47 };
    await shop.insertOne(mockShop);

    const insertedTicket = await shop.findOne({ _id: "3" });
    expect(insertedTicket).toEqual(mockShop);
  });
});
