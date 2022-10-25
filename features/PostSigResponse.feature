Feature: POST SignatureResponse

  Scenario: Happy path
    Given I click to sign in
    And I click the sign in button
    And I submit and get a valid SignatureRequest
    And I have a valid SignatureResponse
    When I post it to /signatureresponse
    Then I get a token

  Scenario: Expired access_token
    Given I click to sign in
    And I click the sign in button
    And I submit and get a valid SignatureRequest
    And I have AN EXPIRED access_token
    And I have a valid SignatureResponse
    When I post it to /signatureresponse
    Then I get statusCode 401

  Scenario: No certificate in SignatureResponse
    Given I click to sign in
    And I click the sign in button
    And I submit and get a valid SignatureRequest
    And I have a SignatureResponse with no certificate
    When I post it to /signatureresponse
    Then I get message "Invalid request payload: \"certificate\" is required"

  Scenario: No signatures in SignatureResponse
    Given I click to sign in
    And I click the sign in button
    And I submit and get a valid SignatureRequest
    And I have a SignatureResponse with no signatures
    When I post it to /signatureresponse
    Then I get message "Invalid request payload: \"signatures\" is required"

  Scenario: Mismatched request (2 payloads) response (1 signature)
    Given I click to sign in
    And I click the sign in button
    And I submit and get a SignatureRequest with multiple payloads
    And I have a valid SignatureResponse
    When I post it to /signatureresponse
    Then I get a token

  Scenario: Mismatched request (2 payloads) response (1 different signature)
    Given I click to sign in
    And I click the sign in button
    And I submit and get a SignatureRequest with multiple payloads
    And I have a valid SignatureResponse for id 3
    When I post it to /signatureresponse
    Then I get a token

  Scenario: Wrong token used
    Given I click to sign in
    And I click the sign in button
    And I submit and get a valid SignatureRequest
    And I have a valid SignatureResponse
    When I post it to /signatureresponse using the wrong token
    Then I get message "No signature request for specified token"

  Scenario: Invalid token used
    Given I click to sign in
    And I click the sign in button
    And I submit and get a valid SignatureRequest
    And I have a valid SignatureResponse
    When I post it to /signatureresponse using an invalid token
    Then I get message "Invalid request params: \"token\" must be a valid base64 string"
