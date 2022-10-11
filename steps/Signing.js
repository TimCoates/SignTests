var prompt = require('prompt-sync')();
const Given = require("cucumber").Given;
const Then = require("cucumber").Then;
const When = require("cucumber").When;
const assert = require('assert');
const fs = require('fs');
const APIURL = "https://int.api.service.nhs.uk/signing-service";
const validJWT = fs.readFileSync("./tokens/validJWT.jwt");

const validSignatureResponse = {
	"signatures": [
		{
			"id": "ZjE2NWE2OTMtOGFmMC00MWRkLWEyYjEtYzgzMWQ2NGY1Nzky",
			"signature": "Q+yEfnM5PA2punGmevuvLtwj4+XRsWeeiq7SJ9Ekd28NJ9jVtCa9oB3bU2aGl5wlX8HufH2GFJgg9o9OFFrSvRAPpgWKW4/+3aL06S9B7YT4MQP/7St2gL1v2+v4tmQ7CSvF+VTFVugIezewAQPKvhJaNLHD+njOD+60W9pK17U="
		}
	],
	"certificate": "MIID9DCCAtygAwIBAgIEQd28HjANBgkqhkiG9w0BAQUFADAyMQwwCgYDVQQKEwNuaHMxCzAJBgNVBAsTAkNBMRUwEwYDVQQDFAxOSVMyX1NVQkNBQ0MwHhcNMDUwNjAzMDg0OTM5WhcNMDcwNjAzMDkxOTM5WjBFMQwwCgYDVQQKDANuaHMxDzANBgNVBAsMBlBlb3BsZTEkMCIGA1UEAwwbNjY5ODEwODE5MDEzX2pvaG5fd2hpdGVzaWRlMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCd56UQCtS3DFH7gy851azIEcPXwwqnhR1U7/a6xGqVjw+eKzBr2JW96loo6qDyCvhyokkYfteRP428e9euU11YdcOXQkqlRp7OpqAJSGdcgdMn5GCpKOU5eQVkvKq7eVXRBGoHfDbK5eakY3g51VorjVrRWK3UTNHLaJ9i265+cwIDAQABo4IBgTCCAX0wDgYDVR0PAQH/BAQDAgZAMCsGA1UdEAQkMCKADzIwMDUwNjAzMDg0OTM5WoEPMjAwNzA2MDMwOTE5MzlaMIGBBgNVHSABAf8EdzB1MHMGCyqGOgCJe2YAAwIAMGQwYgYIKwYBBQUHAgEWVmh0dHA6Ly9ud3cubnBmaXQubmhzLnVrL2luZm9ybWF0aW9uX2dvdmVybmFuY2UvY2VydGlmaWNhdGVfcG9saWNpZXMvY29udGVudF9jb21taXRtZW50MFQGA1UdHwRNMEswSaBHoEWkQzBBMQwwCgYDVQQKEwNuaHMxCzAJBgNVBAsTAkNBMRUwEwYDVQQDFAxOSVMyX1NVQkNBQ0MxDTALBgNVBAMTBENSTDYwHwYDVR0jBBgwFoAUf9nfwHnN3lyRuNDqm6KbL5rJrbswHQYDVR0OBBYEFJwcDZUFw6Ycp+tbiRfSNc9O8sGcMAkGA1UdEwQCMAAwGQYJKoZIhvZ9B0EABAwwChsEVjcuMQMCBLAwDQYJKoZIhvcNAQEFBQADggEBAER1g1MwPA6t+y2TJYKEx/fgGUSCCqaCoNvCPNTG32rr8Xcn6csMPn0YunxQe2QrOImRwgbNzgAA1mwggVXt7SpFyhSsAy8k3MdtFeypgbjRpuG5m9IWS9pqoztYnmUfgtsBoms5s4y4exGr68OsF1f2hum96bQ4Ee6De9kAnFJBfCHHNW2NqhdVZ/83VCe09iOYEuJAubGTsWkhMWvqrbsrjmVR7KakiMNkRTPQ4KaexX8coC7+AR/ijvoCMjBXS5vcIX60I2359M2gaQjGjA6bzcuq9y6/MlkAJYo3bbCvwJI4721eHml2X61IAm8nllO0iuRYNf+Vot6nOWhtHc4="
};

let JWT;
let response;
let access_token;
let valid_access_token = prompt('New access token ( from https://nhsd-apim-testing-int-ns.herokuapp.com/ ) please: ');
let token;
let signatureResponse;


Given('I start with a valid JWT', function () {
	JWT = validJWT;
});

// Failings in the upplied JWT header...
Given('I start with a JWT signed with RS1', function () {
	JWT = fs.readFileSync("./tokens/RS1JWT.jwt");
});

Given('I start with a JWT with no alg claim', function () {
	JWT = fs.readFileSync("./tokens/noalg.jwt");
});

Given('I start with a JWT with no kid claim', function () {
	JWT = fs.readFileSync("./tokens/nokid.jwt");
});

Given('I start with a JWT with no typ claim', function () {
	JWT = fs.readFileSync("./tokens/notyp.jwt");
});


// Failings in the supplied JWT Signature
Given('I start with a JWT with a bogus signature', function () {
	JWT = fs.readFileSync("./tokens/bogusSig.jwt");
});

Given('I start with a JWT with no signature', function () {
	JWT = fs.readFileSync("./tokens/noSig.jwt");
});

// Failings in the supplied JWT payload
Given('I start with a JWT with empty payloads array', function () {
	JWT = fs.readFileSync("./tokens/emptyPayloads.jwt");
});

Given('I start with a JWT with duplicate IDs in payloads array', function () {
	JWT = fs.readFileSync("./tokens/duplicateIDs.jwt");
});

Given('I start with a JWT with no iat in the payload', function () {
	JWT = fs.readFileSync("./tokens/noiat.jwt");
});

Given('I start with a JWT with no exp in the payload', function () {
	JWT = fs.readFileSync("./tokens/noexp.jwt");
});

Given('I start with a JWT with no iss in the payload', function () {
	JWT = fs.readFileSync("./tokens/noiss.jwt");
});

Given('I start with a JWT with no sub in the payload', function () {
	JWT = fs.readFileSync("./tokens/nosub.jwt");
});

Given('I start with a JWT with no aud in the payload', function () {
	JWT = fs.readFileSync("./tokens/noaud.jwt");
});

Given('I start with a JWT signed with a not yet valid certificate', function () {
	JWT = fs.readFileSync("./tokens/notYet.jwt");
});

Given('I start with a JWT signed with an expired certificate', function () {
	JWT = fs.readFileSync("./tokens/expired.jwt");
});

Given('I start with a valid JWT with 64 payloads', function () {
	JWT = fs.readFileSync("./tokens/validJWT64.jwt");
});



// Support GET /signaturerequest
Given('I submit a valid SignatureRequest', async function () {
	JWT = fs.readFileSync("./tokens/validJWT.jwt");
	response = await fetch(APIURL + "/signaturerequest", {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + access_token
		},
		body: JWT
	});
	let jsn = await response.json();
	token = jsn.token;
	return true;
});

// Generic to handle access tokens
Given('I have a valid access_token', function () {
	access_token = valid_access_token;
});

Given('I have AN EXPIRED access_token', function () {
	access_token = "SqFsotA0tFn2EbArOrO9wG0Jqec3";
});

// Support for POST /signatureresponse
Given('I have a valid SignatureResponse', function () {
	signatureResponse = validSignatureResponse;
});

Given('I have a valid SignatureResponse for id 3', function () {
	signatureResponse = {
		"signatures": [
			{
				"id": "3",
				"signature": "Q+yEfnM5PA2punGmevuvLtwj4+XRsWeeiq7SJ9Ekd28NJ9jVtCa9oB3bU2aGl5wlX8HufH2GFJgg9o9OFFrSvRAPpgWKW4/+3aL06S9B7YT4MQP/7St2gL1v2+v4tmQ7CSvF+VTFVugIezewAQPKvhJaNLHD+njOD+60W9pK17U="
			}
		],
		"certificate": "MIID9DCCAtygAwIBAgIEQd28HjANBgkqhkiG9w0BAQUFADAyMQwwCgYDVQQKEwNuaHMxCzAJBgNVBAsTAkNBMRUwEwYDVQQDFAxOSVMyX1NVQkNBQ0MwHhcNMDUwNjAzMDg0OTM5WhcNMDcwNjAzMDkxOTM5WjBFMQwwCgYDVQQKDANuaHMxDzANBgNVBAsMBlBlb3BsZTEkMCIGA1UEAwwbNjY5ODEwODE5MDEzX2pvaG5fd2hpdGVzaWRlMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCd56UQCtS3DFH7gy851azIEcPXwwqnhR1U7/a6xGqVjw+eKzBr2JW96loo6qDyCvhyokkYfteRP428e9euU11YdcOXQkqlRp7OpqAJSGdcgdMn5GCpKOU5eQVkvKq7eVXRBGoHfDbK5eakY3g51VorjVrRWK3UTNHLaJ9i265+cwIDAQABo4IBgTCCAX0wDgYDVR0PAQH/BAQDAgZAMCsGA1UdEAQkMCKADzIwMDUwNjAzMDg0OTM5WoEPMjAwNzA2MDMwOTE5MzlaMIGBBgNVHSABAf8EdzB1MHMGCyqGOgCJe2YAAwIAMGQwYgYIKwYBBQUHAgEWVmh0dHA6Ly9ud3cubnBmaXQubmhzLnVrL2luZm9ybWF0aW9uX2dvdmVybmFuY2UvY2VydGlmaWNhdGVfcG9saWNpZXMvY29udGVudF9jb21taXRtZW50MFQGA1UdHwRNMEswSaBHoEWkQzBBMQwwCgYDVQQKEwNuaHMxCzAJBgNVBAsTAkNBMRUwEwYDVQQDFAxOSVMyX1NVQkNBQ0MxDTALBgNVBAMTBENSTDYwHwYDVR0jBBgwFoAUf9nfwHnN3lyRuNDqm6KbL5rJrbswHQYDVR0OBBYEFJwcDZUFw6Ycp+tbiRfSNc9O8sGcMAkGA1UdEwQCMAAwGQYJKoZIhvZ9B0EABAwwChsEVjcuMQMCBLAwDQYJKoZIhvcNAQEFBQADggEBAER1g1MwPA6t+y2TJYKEx/fgGUSCCqaCoNvCPNTG32rr8Xcn6csMPn0YunxQe2QrOImRwgbNzgAA1mwggVXt7SpFyhSsAy8k3MdtFeypgbjRpuG5m9IWS9pqoztYnmUfgtsBoms5s4y4exGr68OsF1f2hum96bQ4Ee6De9kAnFJBfCHHNW2NqhdVZ/83VCe09iOYEuJAubGTsWkhMWvqrbsrjmVR7KakiMNkRTPQ4KaexX8coC7+AR/ijvoCMjBXS5vcIX60I2359M2gaQjGjA6bzcuq9y6/MlkAJYo3bbCvwJI4721eHml2X61IAm8nllO0iuRYNf+Vot6nOWhtHc4="
	};
});

Given('I have a SignatureResponse with no certificate', function () {
	signatureResponse = {
		"signatures": [
			{
				"id": "ZjE2NWE2OTMtOGFmMC00MWRkLWEyYjEtYzgzMWQ2NGY1Nzky",
				"signature": "Q+yEfnM5PA2punGmevuvLtwj4+XRsWeeiq7SJ9Ekd28NJ9jVtCa9oB3bU2aGl5wlX8HufH2GFJgg9o9OFFrSvRAPpgWKW4/+3aL06S9B7YT4MQP/7St2gL1v2+v4tmQ7CSvF+VTFVugIezewAQPKvhJaNLHD+njOD+60W9pK17U="
			}
		]
	};
});

Given('I have a SignatureResponse with no signatures', function () {
	signatureResponse = {
		"certificate": "MIID9DCCAtygAwIBAgIEQd28HjANBgkqhkiG9w0BAQUFADAyMQwwCgYDVQQKEwNuaHMxCzAJBgNVBAsTAkNBMRUwEwYDVQQDFAxOSVMyX1NVQkNBQ0MwHhcNMDUwNjAzMDg0OTM5WhcNMDcwNjAzMDkxOTM5WjBFMQwwCgYDVQQKDANuaHMxDzANBgNVBAsMBlBlb3BsZTEkMCIGA1UEAwwbNjY5ODEwODE5MDEzX2pvaG5fd2hpdGVzaWRlMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCd56UQCtS3DFH7gy851azIEcPXwwqnhR1U7/a6xGqVjw+eKzBr2JW96loo6qDyCvhyokkYfteRP428e9euU11YdcOXQkqlRp7OpqAJSGdcgdMn5GCpKOU5eQVkvKq7eVXRBGoHfDbK5eakY3g51VorjVrRWK3UTNHLaJ9i265+cwIDAQABo4IBgTCCAX0wDgYDVR0PAQH/BAQDAgZAMCsGA1UdEAQkMCKADzIwMDUwNjAzMDg0OTM5WoEPMjAwNzA2MDMwOTE5MzlaMIGBBgNVHSABAf8EdzB1MHMGCyqGOgCJe2YAAwIAMGQwYgYIKwYBBQUHAgEWVmh0dHA6Ly9ud3cubnBmaXQubmhzLnVrL2luZm9ybWF0aW9uX2dvdmVybmFuY2UvY2VydGlmaWNhdGVfcG9saWNpZXMvY29udGVudF9jb21taXRtZW50MFQGA1UdHwRNMEswSaBHoEWkQzBBMQwwCgYDVQQKEwNuaHMxCzAJBgNVBAsTAkNBMRUwEwYDVQQDFAxOSVMyX1NVQkNBQ0MxDTALBgNVBAMTBENSTDYwHwYDVR0jBBgwFoAUf9nfwHnN3lyRuNDqm6KbL5rJrbswHQYDVR0OBBYEFJwcDZUFw6Ycp+tbiRfSNc9O8sGcMAkGA1UdEwQCMAAwGQYJKoZIhvZ9B0EABAwwChsEVjcuMQMCBLAwDQYJKoZIhvcNAQEFBQADggEBAER1g1MwPA6t+y2TJYKEx/fgGUSCCqaCoNvCPNTG32rr8Xcn6csMPn0YunxQe2QrOImRwgbNzgAA1mwggVXt7SpFyhSsAy8k3MdtFeypgbjRpuG5m9IWS9pqoztYnmUfgtsBoms5s4y4exGr68OsF1f2hum96bQ4Ee6De9kAnFJBfCHHNW2NqhdVZ/83VCe09iOYEuJAubGTsWkhMWvqrbsrjmVR7KakiMNkRTPQ4KaexX8coC7+AR/ijvoCMjBXS5vcIX60I2359M2gaQjGjA6bzcuq9y6/MlkAJYo3bbCvwJI4721eHml2X61IAm8nllO0iuRYNf+Vot6nOWhtHc4="
	};
});

// Combined actions to get us there...
Given('I submit and get a valid SignatureRequest', async function () {
	JWT = validJWT;
	response = await fetch(APIURL + "/signaturerequest", {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + access_token
		},
		body: JWT
	});
	let jsn = await response.json();
	token = jsn.token;

	response = await fetch(APIURL + "/signaturerequest/" + token, {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + access_token
		}
	}).then(async response => {
		//console.log("Response: " + await response.text());
	});
	return true;
});

Given('I submit and get a SignatureRequest with multiple payloads', async function () {
	JWT = fs.readFileSync("./tokens/multiple.jwt");
	response = await fetch(APIURL + "/signaturerequest", {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + access_token
		},
		body: JWT
	});
	let jsn = await response.json();
	token = jsn.token;

	response = await fetch(APIURL + "/signaturerequest/" + token, {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + access_token
		}
	}).then(async response => {
		//console.log("Response: " + await response.text());
	});
	return true;
});


When('I post it to /signaturerequest', async function () {
	response = await fetch(APIURL + "/signaturerequest", {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + access_token
		},
		body: JWT
	});
	return true;
});

When('I post it to /signatureresponse', async function () {
	response = await fetch(APIURL + "/signatureresponse/" + token, {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + access_token,
			'Content-Type': 'application/JSON',
		},
		body: JSON.stringify(signatureResponse)
	});
	return true;
});

When('I post it to /signatureresponse using the wrong token', async function () {
	response = await fetch(APIURL + "/signatureresponse/YWJmNjZiZTItYTE3NC00N2RlLTkxNzgtYzFjZDA2NWJmZGJh", {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + access_token,
			'Content-Type': 'application/JSON',
		},
		body: JSON.stringify(signatureResponse)
	});
	return true;
});

When('I post it to /signatureresponse using an invalid token', async function () {
	response = await fetch(APIURL + "/signatureresponse/YWJmNjZiZTItYTE3NC00N2RlLTkxNzgtYzFjZD___WJmZGJh", {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + access_token,
			'Content-Type': 'application/JSON',
		},
		body: JSON.stringify(signatureResponse)
	});
	return true;
});

When('I GET from /signaturerequest', async function () {
	response = await fetch(APIURL + "/signaturerequest/" + token, {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + access_token
		}
	});
	return true;
});

When('I GET from /signaturerequest with an incorrect token', async function () {
	response = await fetch(APIURL + "/signaturerequest/YWJmNjZiZTItYTE3NC00N2RlLTkxNzgtYzFjZDA2NWJmZGJh", {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + access_token
		}
	});
	return true;
});

When('I GET from /signaturerequest with an invalid token', async function () {
	response = await fetch(APIURL + "/signaturerequest/YWJmNjZiZTItYTE3NC00N2RlLTkxNzgtYzFjZD___WJmZGJh", {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + access_token
		}
	});
	return true;
});



// Support for GET SignatureResponse
When('I GET from /signatureresponse', async function () {
	response = await fetch(APIURL + "/signatureresponse/" + token, {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + access_token
		}
	});
	return true;
});

When('I GET from /signatureresponse with an incorrect token', async function () {
	response = await fetch(APIURL + "/signatureresponse/YWJmNjZiZTItYTE3NC00N2RlLTkxNzgtYzFjZDA2NWJmZGJh", {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + access_token
		}
	});
	return true;
});


When('I GET from /signatureresponse with an invalid token', async function () {
	response = await fetch(APIURL + "/signatureresponse/YWJmNjZiZTItYTE3NC00N2RlLTkxNzgtYzFjZD___WJmZGJh", {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + access_token
		}
	});
	return true;
});




// Here come our assertions
Then('I get statusCode {word}', function (expected) {
	assert.equal(response.status, expected);
});

Then('I get message {string}', async function (expected) {
	let res = await response.json();
	assert.ok('message' in res);
	assert.equal(res.message, expected);
});

Then('I get message containing {string}', async function (expected) {
	let res = await response.json();
	assert.ok(res.message.indexOf(expected));
});

Then('I get a token', async function () {
	let res = await response.json();
	//console.log(JSON.stringify(res));
	assert.ok('token' in res);
	assert.ok('redirectUri' in res);
});

Then('I get the original SignatureRequest', async function () {
	let res = await response.text();
	assert.equal(res, JWT);
});

Then('I get the expected SignatureResponse', async function () {
	let res = await response.json();
	assert.equal(res.signatures[0].id, validSignatureResponse.signatures[0].id);
	assert.equal(res.signatures[0].signature, validSignatureResponse.signatures[0].signature);
	assert.equal(res.certificate, validSignatureResponse.certificate);
});
