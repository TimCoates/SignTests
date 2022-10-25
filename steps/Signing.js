let utils = require("./utils");
const Given = require("cucumber").Given;
const Then = require("cucumber").Then;
const When = require("cucumber").When;
const assert = require('assert');
const fs = require('fs');
const APIURL = "https://int.api.service.nhs.uk/signing-service";
const validJWT = utils.valid();
const baseURL = "https://int.api.service.nhs.uk/";

When('I click to sign in', async function () {
	const clientID = "XSyiT9xE71bTtGsDYLQXbwEOUGJw7G1U";
	const redirect = "https%3A%2F%2Fnhsd-apim-testing-int-ns.herokuapp.com%2Fcallback";
	const suffix = "response_type=code&state=1234567890";
	let url = baseURL + "/oauth2-no-smartcard/authorize?client_id=" + clientID + "&redirect_uri=" + redirect + "&" + suffix;
	let resp = await fetch(url);
	let body = await resp.text();
	// Extract the state from the response...
	let start = body.indexOf('<input name=\"state\"') + 41;
	let state = body.substring(start, start + 50);
	// Store into 'this'
	this.state = state.substring(0, state.indexOf('\"'));
	return true;
});

When('I click the sign in button', async function () {
	let url = baseURL + "/mock-nhsid-jwks/simulated_auth?response_type=code&client_id=some-client-id&redirect_uri=https://int.api.service.nhs.uk/oauth2-no-smartcard/callback&scope=openid%20nationalrbacaccess&state=" + this.state + "&max_age=300"
	let body = "state=" + this.state + "&auth_method=N3_SMARTCARD";

	// First call...
	response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
		},
		redirect: 'manual',
		body: body
	});
	let location = response.headers.get('location');

	// Second call...
	response = await fetch(location, { redirect: 'manual' });
	location = response.headers.get("location");

	// Third call///
	response = await fetch(location);
	let html = await response.text();

	// Pull out the access_token from the response...
	let start = html.indexOf("access_token") + 24;
	let token = html.substring(start, start + 100);
	let end = token.indexOf("&");
	token = token.substring(0, end);
	//console.log("Final token: " + token);

	// Store token into 'this'
	this.access_token = token;
	return true;
});

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
let token;
let signatureResponse;


Given('I start with a valid JWT', function () {
	JWT = utils.valid();
});

// Failings in the upplied JWT header...
Given('I start with a JWT signed with RS1', function () {
	JWT = utils.RS1();
});

Given('I start with a JWT with no alg claim', function () {
	JWT = utils.noALG();
});

Given('I start with a JWT with no kid claim', function () {
	JWT = utils.noKID();
});

Given('I start with a JWT with no typ claim', function () {
	JWT = utils.noTYP();
});


// Failings in the supplied JWT Signature
Given('I start with a JWT with a bogus signature', function () {
	JWT = utils.badSignature();
});

Given('I start with a JWT with no signature', function () {
	JWT = utils.noSignature();
});

// Failings in the supplied JWT payload
Given('I start with a JWT with empty payloads array', function () {
	JWT = utils.emptyPayloads();
});

Given('I start with a JWT with duplicate IDs in payloads array', function () {
	JWT = utils.duplicateIDs();
});

Given('I start with a JWT with no iat in the payload', function () {
	JWT = utils.noIAT();
});

Given('I start with a JWT with no exp in the payload', function () {
	JWT = utils.noEXP();
});

Given('I start with a JWT with no iss in the payload', function () {
	JWT = utils.noISS();
});

Given('I start with a JWT with no sub in the payload', function () {
	JWT = utils.noSUB();
});

Given('I start with a JWT with no aud in the payload', function () {
	JWT = utils.noAUD();
});

Given('I start with a JWT with an unusual aud in the payload', function () {
	JWT = utils.oddAUD();
});

Given('I start with a JWT with a non URL aud in the payload', function () {
	JWT = utils.bodynoURLAUD();
});


Given('I start with a JWT signed with a not yet valid certificate', function () {
	JWT = utils.notYetValid();
});

Given('I start with a JWT signed with an expired certificate', function () {
	JWT = utils.expired();
});

Given('I start with a valid JWT with 64 payloads', function () {
	JWT = utils.manyPayloads(64);
});

Given('I start with a valid JWT with 250 payloads', function () {
	JWT = utils.manyPayloads(250);
});

Given('I start with a valid JWT with 251 payloads', function () {
	JWT = utils.manyPayloads(251);
});



// Support GET /signaturerequest
Given('I submit a valid SignatureRequest', async function () {
	JWT = utils.valid();
	response = await fetch(APIURL + "/signaturerequest", {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + this.access_token
		},
		body: JWT
	});
	let jsn = await response.json();
	token = jsn.token;
	return true;
});


Given('I have AN EXPIRED access_token', function () {
	this.access_token = "SqFsotA0tFn2EbArOrO9wG0Jqec3";
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
			'Authorization': 'Bearer ' + this.access_token
		},
		body: JWT
	});
	let jsn = await response.json();
	token = jsn.token;

	response = await fetch(APIURL + "/signaturerequest/" + token, {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + this.access_token
		}
	}).then(async response => {
		//console.log("Response: " + await response.text());
	});
	return true;
});

Given('I submit and get a SignatureRequest with multiple payloads', async function () {
	JWT = utils.manyPayloads(3);
	response = await fetch(APIURL + "/signaturerequest", {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + this.access_token
		},
		body: JWT
	});
	let jsn = await response.json();
	token = jsn.token;

	response = await fetch(APIURL + "/signaturerequest/" + token, {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + this.access_token
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
			'Authorization': 'Bearer ' + this.access_token
		},
		body: JWT
	});
	return true;
});

When('I post it to /signatureresponse', async function () {
	response = await fetch(APIURL + "/signatureresponse/" + token, {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + this.access_token,
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
			'Authorization': 'Bearer ' + this.access_token,
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
			'Authorization': 'Bearer ' + this.access_token,
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
			'Authorization': 'Bearer ' + this.access_token
		}
	});
	return true;
});

When('I GET from /signaturerequest with an incorrect token', async function () {
	response = await fetch(APIURL + "/signaturerequest/YWJmNjZiZTItYTE3NC00N2RlLTkxNzgtYzFjZDA2NWJmZGJh", {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + this.access_token
		}
	});
	return true;
});

When('I GET from /signaturerequest with an invalid token', async function () {
	response = await fetch(APIURL + "/signaturerequest/YWJmNjZiZTItYTE3NC00N2RlLTkxNzgtYzFjZD___WJmZGJh", {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + this.access_token
		}
	});
	return true;
});



// Support for GET SignatureResponse
When('I GET from /signatureresponse', async function () {
	response = await fetch(APIURL + "/signatureresponse/" + token, {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + this.access_token
		}
	});
	return true;
});

When('I GET from /signatureresponse with an incorrect token', async function () {
	response = await fetch(APIURL + "/signatureresponse/YWJmNjZiZTItYTE3NC00N2RlLTkxNzgtYzFjZDA2NWJmZGJh", {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + this.access_token
		}
	});
	return true;
});


When('I GET from /signatureresponse with an invalid token', async function () {
	response = await fetch(APIURL + "/signatureresponse/YWJmNjZiZTItYTE3NC00N2RlLTkxNzgtYzFjZD___WJmZGJh", {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + this.access_token
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
