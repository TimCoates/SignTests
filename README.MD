# Signing Service API Tests

## Requirements
Requires a minimum of node v17 due to the use of fetch().

Uses npm packages (so yes node_modules is huge);

Uses access_tokens provided [here](https://nhsd-apim-testing-int-ns.herokuapp.com/), the retrieval of the `access_token` is automated

## Usage
```
$ git clone git@github.com:TimCoates/SignTests.git
$ cd SignTests
$ npm install
$ npm test
```
## Implementation details
All tests are separated into a .feature file per API call, in the `./features` directory.

All tests use shared implementation in `./steps/Signing.js`.

## Sample output
```
user@hostname:/SignTests$ npm test

> signtests@1.0.0 test
> ./node_modules/.bin/cucumber-js features/ -r steps/

(node:2577) ExperimentalWarning: The Fetch API is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
...........................................................................................................................................................................................................................

40 scenarios (40 passed)
219 steps (219 passed)
0m26.365s
```

__NB: Several of the tests currently pass, but should probably fail__

🔴 POST /signaturerequest explicitly requires a signature component on the supplied JWT. It also validates that there are (as you might expect) `alg`, `iat`, `exp`, `aud`, `sub`, `kid` and `iss` claims in the payload.

🔴 It insists on `alg` being `RS512`.

🔴 BUT the signature can be nonsense.

🔴 It checks that `iat` and `exp` exist, but it accepts both expired and not yet valid values in them.

🔴 It insists on requests to sign using `RS1` - i.e. it can't (currently) switch to RS256 (for SHA-256).

🔴 It accepts a payload with an empty array of payloads.

🔴 It allows `aud` in the JWT payload to be any URL.
