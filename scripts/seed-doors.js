// Creates the 24 doors in the database.
// Run with: npm run seed
//
// Safe to run again: doors that already exist are NOT overwritten,
// so content that teachers have edited stays as it is.

const mongoose = require("mongoose");
const connectToDatabase = require("../config/database");
const Door = require("../models/door");

const YEAR = 2026;

// A door opens at 00:00 Norwegian time.
// In December Norway is UTC+1, so 00:00 in Norway = 23:00 UTC the day before.
// Months in JavaScript start at 0, so 11 = December.
// Date.UTC(2026, 11, 0, 23) = "day 0 of December" = 30 November 23:00 UTC. JavaScript handles that for us.
function openingTime(day) {
    return new Date(Date.UTC(YEAR, 11, day - 1, 23, 0, 0));
}

async function seedDoors() {
    await connectToDatabase();

    for (let day = 1; day <= 24; day++) {
        // upsert = "update if it exists, insert if it doesn't"
        // $setOnInsert = only set these fields when the door is created
        const result = await Door.updateOne(
            { day },
            {
                $setOnInsert: {
                    day,
                    opensAt: openingTime(day),
                    title: `Luke ${day}`,
                    text: "Innholdet til denne luken kommer snart.",
                    question: "Hva feirer vi 24. desember?",
                    correctAnswer: "jul",
                    giftImage: `/img/${day}.png`,
                    giftPrice: 5
                }
            },
            { upsert: true }
        );

        const status = result.upsertedCount === 1 ? "created" : "already exists";
        console.log(`Door ${day}: ${status} (opens ${openingTime(day).toISOString()})`);
    }
}

seedDoors()
    .catch((error) => {
        console.error("Seeding failed:", error.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect()); // close the connection so the script can exit
