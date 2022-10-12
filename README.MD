# Signing Service API Tests

## Requirements
Requires a minimum of node v17 due to the use of fetch().

Uses npm packages (so yes node_modules is huge);

Uses access_tokens provided [here](https://nhsd-apim-testing-int-ns.herokuapp.com/)

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

__NB: Several of the tests currently pass, but should probably fail__

POST /signaturerequest explicitly requires a signature component on the supplied JWT. It also validates that there are (as you might expect) `alg`, `iat`, `exp`, `aud`, `sub`, `kid` and `iss` claims in the payload.

It insists on `alg` being `RS512`.

BUT the signature can be nonsense.

It checks that `iat` and `exp` exist, but it accepts both expired and not yet valid values in them.

It insists on requests to sign using `RS1` - i.e. it can't (currently) switch to RS256 (for SHA-256).

It accepts a payload with an empty array of payloads.

It accepts > 250 payloads (there's a stated limit of 250 not enforced).