// check the password script

const {
    hashPassword,
    verifyPassword
} = require('../utlits/password');

async function checkPassword () {
    const password = "Demo-only-password-2026";
    const passwordHash = await hashPassword(password);

    const correctPassword = await verifyPassword(
        passwordHash,
        password
    );

    const wrongPassword = await verifyPassword(
        passwordHash,
        "Wrong-password"
    );

    console.log ("correct password:", correctPassword); // should be true
    console.log ("wrong password:", wrongPassword); // should be false
}

checkPassword().catch ((error)  => {
    console.error("Password check failed:", error.message);
    process.exitCode = 1;
});

// To run this script, use the command: node scripts/check-password.js