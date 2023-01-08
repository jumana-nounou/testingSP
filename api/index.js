require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { mongoClient } = require("./mongo");
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// available > pending + el quantity
async function isPendingAvailable(matchNo, category, quantity) {
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");
  const match = await db.collection("Shop").findOne({
    matchNumber: matchNo,
  });

  if (
    category == 1 &&
    match.availability.category1.available >
      match.availability.category1.pending + quantity
  )
    return true;
  else if (
    category == 2 &&
    match.availability.category2.available >
      match.availability.category2.pending + quantity
  )
    return true;
  else if (
    category == 3 &&
    match.availability.category3.available >
      match.availability.category3.pending + quantity
  )
    return true;
  else return false;
}

// GET ticket DONE
app.get("/api/ticket/:id", async (req, res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");

  let ticket = await db.collection("Shop").findOne({ id: req.params.id });
  res.status(200).send(ticket);
});

// GET ALL TICKETS DONE
app.get("/api/allTickets", async (req, res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");

  const tickets = await db.collection("Shop").find({}).toArray();
  res.status(200).send(tickets);
});

// POST MASTERLIST DONE BAS LAZEM NEGARABHA
app.post("/api/masterlist", async (req, res) => {
  try {
    const db = await mongoClient();
    if (!db) res.status(500).send("Systems Unavailable");
    //console.log(req.body.availability.category1.available)
    const masterObj = {
      matchNumber: req.body.matchNumber,
      roundNumber: req.body.roundNumber,
      dateUtc: req.body.dateUtc,
      location: req.body.location,
      availability: {
        category1: {
          available: req.body.availability.category1.available,
          pending: req.body.availability.category1.pending,
          price: req.body.availability.category1.price,
        },
        category2: {
          available: req.body.availability.category2.available,
          pending: req.body.availability.category2.pending,
          price: req.body.availability.category2.price,
        },
        category3: {
          available: req.body.availability.category3.available,
          pending: req.body.availability.category3.pending,
          price: req.body.availability.category3.price,
        },
      },
      homeTeam: req.body.homeTeam,
      awayTeam: req.body.awayTeam,
      group: req.body.group,
    };
    await db.collection("Shop").insertOne(masterObj);
    return res.status(200).send(masterObj);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

//test
app.get("/api/test/:matchNumber", async (req, res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");

  const test = await db.collection("Shop").findOne({
    matchNumber: Number(req.params.matchNumber),
  });
  // console.log(test.availability.category1);

  res.status(200).send(test.availability.category1);
});

//patch pending ticket DONE
app.patch(
  "/api/pendingTicket/:matchNumber/:categoryNo/:pending",
  async (req, response) => {
    const db = await mongoClient();
    if (!db) res.status(500).send("Systems Unavailable");
    let query;
    let newVal;
    if (
      await isPendingAvailable(
        Number(req.params.matchNumber),
        Number(req.params.categoryNo),
        Number(req.params.pending)
      )
    ) {
      if (Number(req.params.categoryNo) == 1) {
        query = { matchNumber: Number(req.params.matchNumber) };
        newVal = {
          $inc: {
            "availability.category1.pending": Number(req.params.pending),
          },
        };
      } else if (Number(req.params.categoryNo) == 2) {
        query = { matchNumber: Number(req.params.matchNumber) };
        newVal = {
          $inc: {
            "availability.category2.pending": Number(req.params.pending),
          },
        };
      } else if (Number(req.params.categoryNo) == 3) {
        query = { matchNumber: Number(req.params.matchNumber) };
        newVal = {
          $inc: {
            "availability.category3.pending": Number(req.params.pending),
          },
        };
        db.collection("Shop").updateOne(query, newVal, function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
          response.json(res);
        });
      }
      db.collection("Shop").updateOne(query, newVal, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        response.json({ message: "Ticket Pending" });
      });
    } else response.json({ message: "TICKET OUT OF STOCK" });
  }
);

//PATCH RESERVE DONE
app.patch(
  "/api/reservedTicket/:matchNumber/:categoryNo/:availability/:pending",
  async (req, response) => {
    const db = await mongoClient();
    if (!db) res.status(500).send("Systems Unavailable");
    let query;
    let newVal;
    if (Number(req.params.categoryNo) == 1) {
      let decAvailability = Number(req.params.availability) * -1;
      let decPending = Number(req.params.pending) * -1;
      query = { matchNumber: Number(req.params.matchNumber) };
      newVal = {
        $inc: {
          "availability.category1.pending": decPending,
          "availability.category1.available": decAvailability,
        },
      };
    } else if (Number(req.params.categoryNo) == 2) {
      let decAvailability = Number(req.params.availability) * -1;
      let decPending = Number(req.params.pending) * -1;
      query = { matchNumber: Number(req.params.matchNumber) };
      newVal = {
        $inc: {
          "availability.category2.pending": decPending,
          "availability.category2.available": decAvailability,
        },
      };
    } else if (Number(req.params.categoryNo) == 3) {
      let decAvailability = Number(req.params.availability) * -1;
      let decPending = Number(req.params.pending) * -1;
      query = { matchNumber: Number(req.params.matchNumber) };
      newVal = {
        $inc: {
          "availability.category3.pending": decPending,
          "availability.category3.available": decAvailability,
        },
      };
    }
    db.collection("Shop").updateOne(query, newVal, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json({ message: "Ticket Reserved" });
    });
  }
);

//PATCH CANCELLED
app.patch(
  "/api/cancelledTicket/:matchNumber/:categoryNo/:pending",
  async (req, response) => {
    const db = await mongoClient();
    if (!db) res.status(500).send("Systems Unavailable");
    let query;
    let newVal;
    if (Number(req.params.categoryNo) == 1) {
      let decPending = Number(req.params.pending);
      query = { matchNumber: Number(req.params.matchNumber) };
      newVal = {
        $inc: {
          "availability.category1.pending": -decPending,
        },
      };
    } else if (Number(req.params.categoryNo) == 2) {
      let decPending = Number(req.params.pending);
      query = { matchNumber: Number(req.params.matchNumber) };
      newVal = {
        $inc: {
          "availability.category2.pending": -decPending,
        },
      };
    } else if (Number(req.params.categoryNo) == 3) {
      let decPending = Number(req.params.pending);
      query = { matchNumber: Number(req.params.matchNumber) };
      newVal = {
        $inc: {
          "availability.category3.pending": -decPending,
        },
      };
    }
    db.collection("Shop").updateOne(query, newVal, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json({ message: "Ticket Cancelled" });
    });
  }
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
