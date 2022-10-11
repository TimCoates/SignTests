Feature: POST SignatureRequest

  Scenario: Valid JWT and valid token
    Given I start with a valid JWT
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get a token

  Scenario: Valid JWT expired token
    Given I start with a valid JWT
    And I have AN EXPIRED access_token
    When I post it to /signaturerequest
    Then I get statusCode 401

  Scenario: Signed with RS1 check status
    Given I start with a JWT signed with RS1
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get statusCode 400

  Scenario: Signed with RS1 check message
    Given I start with a JWT signed with RS1
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get message "JWT header is not valid. \"alg\" must be [RS512]"

  Scenario: No alg in header
    Given I start with a JWT with no alg claim
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get message "JWT header is not valid. \"alg\" is required"

  Scenario: No kid in header
    Given I start with a JWT with no kid claim
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get message "JWT header is not valid. \"kid\" is required"

  Scenario: No typ in header
    Given I start with a JWT with no typ claim
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get message "JWT header is not valid. \"typ\" is required"

  Scenario: Bogus signature
    Given I start with a JWT with a bogus signature
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get a token

  Scenario: No signature
    Given I start with a JWT with no signature
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get message containing "fails to match the required pattern"

  Scenario: No iat in payload
    Given I start with a JWT with no iat in the payload
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get message "JWT payload is not valid. \"iat\" is required"

  Scenario: No exp in payload
    Given I start with a JWT with no exp in the payload
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get message "JWT payload is not valid. \"exp\" is required"

  Scenario: No iss in payload
    Given I start with a JWT with no iss in the payload
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get message "JWT payload is not valid. \"iss\" is required"

  Scenario: No sub in payload
    Given I start with a JWT with no sub in the payload
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get message "JWT payload is not valid. \"sub\" is required"

  Scenario: No aud in payload
    Given I start with a JWT with no aud in the payload
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get message "JWT payload is not valid. \"aud\" is required"

  Scenario: Certificate used was not yet valid
    Given I start with a JWT signed with a not yet valid certificate
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get a token

  Scenario: Certificate used has expired
    Given I start with a JWT signed with an expired certificate
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get a token

  Scenario: Empty payloads
    Given I start with a JWT with empty payloads array
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get a token

  Scenario: Duplicate ids in payloads
    Given I start with a JWT with duplicate IDs in payloads array
    And I have a valid access_token
    When I post it to /signaturerequest
    Then I get message "JWT payload is not valid. \"payloads[1]\" contains a duplicate value"
