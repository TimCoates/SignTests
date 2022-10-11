Feature: GET SignatureRequest

  Scenario: Valid access_token and token
    Given I have a valid access_token
    And I submit a valid SignatureRequest
    When I GET from /signaturerequest
    Then I get the original SignatureRequest

  Scenario: Valid token expired access_token
    Given I have a valid access_token
    And I submit a valid SignatureRequest
    And I have AN EXPIRED access_token
    And I submit a valid SignatureRequest
    When I GET from /signaturerequest
    Then I get statusCode 401

  Scenario: Request using incorrect token check message
    Given I have a valid access_token
    And I submit a valid SignatureRequest
    When I GET from /signaturerequest with an incorrect token
    Then I get message "No signature request for specified token"

  Scenario: Request using incorrect token check status
    Given I have a valid access_token
    And I submit a valid SignatureRequest
    When I GET from /signaturerequest with an incorrect token
    Then I get statusCode 404

  Scenario: Request using invalid token check status
    Given I have a valid access_token
    And I submit a valid SignatureRequest
    When I GET from /signaturerequest with an invalid token
    Then I get statusCode 400
