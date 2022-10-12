const base64url = require('base64url');
const crypto = require('crypto')

const headerStructure = {
	"alg": "RS512",
	"typ": "JWT",
	"kid": "nonsense"
};

const bodyStructure = {
	"payloads": [
		{
			"id": "1",
			"payload": makePayload("anything")
		}
	],
	"algorithm": "RS1",
	"iat": Math.floor(new Date().getTime() / 1000) - 600, // Issued 10 mins ago
	"exp": Math.floor(new Date().getTime() / 1000) + 600, // Expires in 10 minutes
	"aud": "https://internal-dev.api.service.nhs.uk/signing-service",
	"iss": "qvP9NoQcOVqKrXEdtLv8B0j7p5VmjPDd",
	"sub": "qvP9NoQcOVqKrXEdtLv8B0j7p5VmjPDd"
};

function makeHash(inString) {
	var shasum = crypto.createHash('sha1');
	shasum.update(inString);
	return shasum.digest('hex');
}

function makePayload(inString) {
	const hash = makeHash(inString);
	const xml = '<SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></CanonicalizationMethod><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"></SignatureMethod><Reference><Transforms><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></Transform></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></DigestMethod><DigestValue>{{hash}}</DigestValue></Reference></SignedInfo>';
	xml.replace("{{hash}}", hash);
	return btoa(unescape(encodeURIComponent(xml)));
}

function header() {
	return base64url(JSON.stringify(headerStructure));
}

function headerRS1() {
	let clone = structuredClone(headerStructure);
	clone.alg = "RS1";
	return base64url(JSON.stringify(clone));
}

function headerNoALG() {
	let clone = structuredClone(headerStructure);
	delete clone.alg;
	return base64url(JSON.stringify(clone));
}

function headerNoTYP() {
	let clone = structuredClone(headerStructure);
	delete clone.typ;
	return base64url(JSON.stringify(clone));
}

function headerNoKID() {
	let clone = structuredClone(headerStructure);
	delete clone.kid;
	return base64url(JSON.stringify(clone));
}

function body() {
	return base64url(JSON.stringify(bodyStructure));
}

function bodyNoPayloads() {
	let clone = structuredClone(bodyStructure);
	delete clone.payloads;
	return base64url(JSON.stringify(clone));
}

function bodyNoAlgorithm() {
	let clone = structuredClone(bodyStructure);
	delete clone.algorithm;
	return base64url(JSON.stringify(clone));
}

function bodyNoIAT() {
	let clone = structuredClone(bodyStructure);
	delete clone.iat;
	return base64url(JSON.stringify(clone));
}

function bodyNoEXP() {
	let clone = structuredClone(bodyStructure);
	delete clone.exp;
	return base64url(JSON.stringify(clone));
}

function bodyNoAUD() {
	let clone = structuredClone(bodyStructure);
	delete clone.aud;
	return base64url(JSON.stringify(clone));
}

function bodyNoISS() {
	let clone = structuredClone(bodyStructure);
	delete clone.iss;
	return base64url(JSON.stringify(clone));
}

function bodyNoSUB() {
	let clone = structuredClone(bodyStructure);
	delete clone.sub;
	return base64url(JSON.stringify(clone));
}

function bodyExpired() {
	let clone = structuredClone(bodyStructure);
	clone.exp = Math.floor(new Date().getTime() / 1000) - 500;
	return base64url(JSON.stringify(clone));
}

function bodyNotYetValid() {
	let clone = structuredClone(bodyStructure);
	clone.iat = Math.floor(new Date().getTime() / 1000) + 500;
	return base64url(JSON.stringify(clone));
}

function bodyEmptyPayloads() {
	let clone = structuredClone(bodyStructure);
	clone.payloads = [];
	return base64url(JSON.stringify(clone));
}

function bodyNPayloads(n) {
	let clone = structuredClone(bodyStructure);
	clone.payloads = [];
	for (let x = 1; x <= n; x++) {
		let item = {
			"id": x.toString(),
			"payload": makePayload(new Date().getTime().toString())
		};
		clone.payloads.push(item);
	}
	return base64url(JSON.stringify(clone));
}

function bodyDuplicateIDs() {
	let clone = structuredClone(bodyStructure);
	clone.payloads = [];
	for (let x = 1; x <= 3; x++) {
		let item = {
			"id": "1",
			"payload": makePayload("Anything")
		};
		clone.payloads.push(item);
	}
	return base64url(JSON.stringify(clone));
}


function signature() {
	return "eK6ak8YjcG8_k5Q0QH1fcDjmoXo-SB3ocNPW3rPLDR99hMv2EdFYulZXk3fPhL4wYaOut16jL0yTKpcfKrNFTNCYW6d7dPF5E984reqmbFqs7ic4PBIZfv8tUHYAgUBE2LT_g60PJdrME5SXcng12h1FXePWBbiAQQKAWBxLv7_aWr0HC7x9CudTr9jF8IdirFN7EpxIph73FE7j0uLmUEME-Fb2Sloi4UvtHBXVoc7KASDi9XAVngInUgsg5G8w_1642zfmbZsKJyemEYRGMHGVGmzoM_pycBxJ8a8BI3HNL_4ZpKEwUXKul09AwO2dzG9EWXTMKJNVA2oawehE4KruI3yvghQjfzq6ta9oyIJ66AKSQQd833_UEEhfLsDFIEx1Im2aVytwmSnRnpDomPuIzpZe7EdX9OR7AS7D1eGTFPX8xANoV7WM5dyrOyP5Iwwc6wztfUEbFmCxaj-qRsCE6YvCX3Pqi6XBXYwpE2x0LLX39a8kOZasAsJBWvSsGIUEBx9xt4g7wl1GbSSFZtr_SogcKGDu-Jz_4LIb5b_VH8lhYCsPxVHLaSf8wKAfecYomZO-Q8TW21B4TVO-M2pPa8Ht5BG5T2XcC-yPm66oF7OUze0uNaRhMXXPRtSYbXxVOlZB7VtywN5MFH4WgXjAepw0pQ9EcVVVAGFJjD0";
}

function valid() {
	return header() + "." + body() + "." + signature();
}

function RS1() {
	return headerRS1() + "." + body() + "." + signature();
}

function noALG() {
	return headerNoALG() + "." + body() + "." + signature();
}

function noTYP() {
	return headerNoTYP() + "." + body() + "." + signature();
}

function noKID() {
	return headerNoKID() + "." + body() + "." + signature();
}

function noPayloads() {
	return header() + "." + bodyNoPayloads() + "." + signature();
}

function noAlgorithm() {
	return header() + "." + bodyNoAlgorithm() + "." + signature();
}

function noIAT() {
	return header() + "." + bodyNoIAT() + "." + signature();
}

function noEXP() {
	return header() + "." + bodyNoEXP() + "." + signature();
}

function noAUD() {
	return header() + "." + bodyNoAUD() + "." + signature();
}

function noISS() {
	return header() + "." + bodyNoISS() + "." + signature();
}

function noSUB() {
	return header() + "." + bodyNoSUB() + "." + signature();
}

function expired() {
	return header() + "." + bodyExpired() + "." + signature();
}

function notYetValid() {
	return header() + "." + bodyNotYetValid() + "." + signature();
}

function emptyPayloads() {
	return header() + "." + bodyEmptyPayloads() + "." + signature();
}

function duplicateIDs() {

	return header() + "." + bodyDuplicateIDs() + "." + signature();
}

function manyPayloads(n) {
	return header() + "." + bodyNPayloads(n) + "." + signature();
}

function noSignature() {
	return header() + "." + body() + ".";
}

function badSignature() {
	return header() + "." + body() + "." + "NONSENSEGOESHERE";
}

module.exports = {
	valid: valid,
	RS1: RS1,
	noALG: noALG,
	noTYP: noTYP,
	noKID: noKID,
	noPayloads: noPayloads,
	noAlgorithm: noAlgorithm,
	noIAT: noIAT,
	noEXP: noEXP,
	noAUD: noAUD,
	noISS: noISS,
	noSUB: noSUB,
	expired: expired,
	notYetValid: notYetValid,
	emptyPayloads: emptyPayloads,
	duplicateIDs: duplicateIDs,
	manyPayloads: manyPayloads,
	noSignature: noSignature,
	badSignature: badSignature
};