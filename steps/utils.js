const base64url = require('base64url');
const headerStructure = {
	"alg": "RS512",
	"typ": "JWT",
	"kid": "nonsense"
};

const bodyStructure = {
	"payloads": [
		{
			"id": "1",
			"payload": "PFNpZ25lZEluZm8+PENhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiPjwvQ2Fub25pY2FsaXphdGlvbk1ldGhvZD48U2lnbmF0dXJlTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI3JzYS1zaGExIj48L1NpZ25hdHVyZU1ldGhvZD48UmVmZXJlbmNlPjxUcmFuc2Zvcm1zPjxUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiPjwvVHJhbnNmb3JtPjwvVHJhbnNmb3Jtcz48RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI3NoYTEiPjwvRGlnZXN0TWV0aG9kPjxEaWdlc3RWYWx1ZT45UUh6UWFGaTJtL2pnNjFYa3REQzdMa3VoRFU9PC9EaWdlc3RWYWx1ZT48L1JlZmVyZW5jZT48L1NpZ25lZEluZm8+"
		}
	],
	"algorithm": "RS1",
	"iat": Math.floor(new Date().getTime() / 1000) - 600, // Issued 10 mins ago
	"exp": Math.floor(new Date().getTime() / 1000) + 600, // Expires in 10 minutes
	"aud": "https://internal-dev.api.service.nhs.uk/signing-service",
	"iss": "qvP9NoQcOVqKrXEdtLv8B0j7p5VmjPDd",
	"sub": "qvP9NoQcOVqKrXEdtLv8B0j7p5VmjPDd"
};

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



module.exports = {
	header: header,
	headerRS1: headerRS1,
	headerNoALG: headerNoALG,
	headerNoTYP: headerNoTYP,
	headerNoKID: headerNoKID
};