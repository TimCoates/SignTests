Feature: GET SignatureResponse

  Scenario: Happy path
    Given I have a valid access_token
    And I submit and get a valid SignatureRequest
	And I have a valid SignatureResponse
    And I post it to /signatureresponse
    When I GET from /signatureresponse
    Then I get the expected SignatureResponse

