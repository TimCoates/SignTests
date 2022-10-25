Feature: GET SignatureResponse

  Scenario: Happy path
    Given I click to sign in
    And I click the sign in button
    And I submit and get a valid SignatureRequest
	  And I have a valid SignatureResponse
    And I post it to /signatureresponse
    When I GET from /signatureresponse
    Then I get the expected SignatureResponse


  Scenario: Expired access_token
    Given I click to sign in
    And I click the sign in button
    And I submit and get a valid SignatureRequest
	  And I have a valid SignatureResponse
    And I post it to /signatureresponse
    And I have AN EXPIRED access_token
    When I GET from /signatureresponse
    Then I get statusCode 401

  Scenario: Incorrect token
    Given I click to sign in
    And I click the sign in button
    And I submit and get a valid SignatureRequest
	  And I have a valid SignatureResponse
    And I post it to /signatureresponse
    When I GET from /signatureresponse with an incorrect token
    Then I get statusCode 404

  Scenario: Invalid token
    Given I click to sign in
    And I click the sign in button
    And I submit and get a valid SignatureRequest
	  And I have a valid SignatureResponse
    And I post it to /signatureresponse
    When I GET from /signatureresponse with an invalid token
    Then I get statusCode 400
