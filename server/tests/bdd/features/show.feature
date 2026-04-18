Feature: Organization Show Management
  As an Organization President
  I want to create new productions
  So that we can start organizing cast, crew, and schedules for upcoming seasons

  Scenario: The President successfully creates a new show
    Given the user "levitybill@gmail.com" is logged in
    And they have the "president" role
    When they attempt to create a new show titled "The Crucible" for the organization
    Then the API should return a "201 Created" status
    And the new show should be saved successfully

  Scenario: Security blocks unauthorized users from creating shows
    Given the user "lilyparker25@outlook.com" is logged in
    And they have the "actor" role
    When they attempt to create a new show titled "Macbeth" for the organization
    Then the API should return a "403 Forbidden" status

  Scenario: Security blocks unauthenticated show creation
    Given no user is logged in
    When they attempt to create a new show titled "Hamlet" for the organization
    Then the API should return a "400 Bad Request" status