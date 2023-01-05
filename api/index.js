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
    MatchNumber: matchNo,
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
  return res.status(200).send(tickets);
});

// POST MASTERLIST DONE BAS LAZEM NEGARABHA
app.post("/api/masterlist", async (req, res) => {
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

  // db.collection("Shop").insertOne(masterObj,function(err,res){
  // if (err)throw err;
  // // response.json(masterObj)
  // return res.send(masterObj);})
});

//test
app.get("/api/test/:MatchNumber", async (req, res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send("Systems Unavailable");

  const test = await db.collection("Shop").findOne({
    MatchNumber: Number(req.params.MatchNumber),
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
    if (
      await isPendingAvailable(
        Number(req.params.matchNumber),
        Number(req.params.categoryNo),
        Number(req.params.pending)
      )
    ) {
      if (Number(req.params.categoryNo) == 1) {
        let query = { MatchNumber: Number(req.params.matchNumber) };
        let newVal = {
          $inc: {
            "availability.category1.pending": Number(req.params.pending),
          },
        };
        db.collection("Shop").updateOne(query, newVal, function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
          response.json(res);
        });
      } else if (Number(req.params.categoryNo) == 2) {
        let query = { MatchNumber: Number(req.params.matchNumber) };
        let newVal = {
          $inc: {
            "availability.category2.pending": Number(req.params.pending),
          },
        };
        db.collection("Shop").updateOne(query, newVal, function (err, res) {
          if (err) throw err;
          console.log("1 document updated");
          response.json(res);
        });
      } else if (Number(req.params.categoryNo) == 3) {
        let query = { MatchNumber: Number(req.params.matchNumber) };
        let newVal = {
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
    } else response.send("TICKET OUT OF STOCK");
  }
);

//PATCH RESERVE DONE
app.patch(
  "/api/reservedTicket/:matchNumber/:categoryNo/:availability/:pending",
  async (req, response) => {
    const db = await mongoClient();
    if (!db) res.status(500).send("Systems Unavailable");

    if (Number(req.params.categoryNo) == 1) {
      let decAvailability = Number(req.params.availability) * -1;
      let decPending = Number(req.params.pending) * -1;
      let query = { MatchNumber: Number(req.params.matchNumber) };
      let newVal = {
        $inc: {
          "availability.category1.pending": decPending,
          "availability.category1.available": decAvailability,
        },
      };
      db.collection("Shop").updateOne(query, newVal, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        response.json(res);
      });
    } else if (Number(req.params.categoryNo) == 2) {
      let decAvailability = Number(req.params.availability) * -1;
      let decPending = Number(req.params.pending) * -1;
      let query = { MatchNumber: Number(req.params.matchNumber) };
      let newVal = {
        $inc: {
          "availability.category2.pending": decPending,
          "availability.category2.available": decAvailability,
        },
      };
      db.collection("Shop").updateOne(query, newVal, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        response.json(res);
      });
    } else if (Number(req.params.categoryNo) == 3) {
      let decAvailability = Number(req.params.availability) * -1;
      let decPending = Number(req.params.pending) * -1;
      let query = { MatchNumber: Number(req.params.matchNumber) };
      let newVal = {
        $inc: {
          "availability.category3.pending": decPending,
          "availability.category3.available": decAvailability,
        },
      };
      db.collection("Shop").updateOne(query, newVal, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        response.json(res);
      });
    }
  }
);

//PATCH CANCELLED
app.patch(
  "/api/cancelledTicket/:matchNumber/:categoryNo/:pending",
  async (req, response) => {
    const db = await mongoClient();
    if (!db) res.status(500).send("Systems Unavailable");

    if (Number(req.params.categoryNo) == 1) {
      let decPending = Number(req.params.pending);
      let query = { MatchNumber: Number(req.params.matchNumber) };
      let newVal = {
        $inc: {
          "availability.category1.pending": -decPending,
        },
      };
      db.collection("Shop").updateOne(query, newVal, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        response.json(res);
      });
    } else if (Number(req.params.categoryNo) == 2) {
      let decPending = Number(req.params.pending);
      let query = { MatchNumber: Number(req.params.matchNumber) };
      let newVal = {
        $inc: {
          "availability.category2.pending": -decPending,
        },
      };
      db.collection("Shop").updateOne(query, newVal, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        response.json(res);
      });
    } else if (Number(req.params.categoryNo) == 3) {
      let decPending = Number(req.params.pending);
      let query = { MatchNumber: Number(req.params.matchNumber) };
      let newVal = {
        $inc: {
          "availability.category3.pending": -decPending,
        },
      };
      db.collection("Shop").updateOne(query, newVal, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        response.json(res);
      });
    }
  }
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
