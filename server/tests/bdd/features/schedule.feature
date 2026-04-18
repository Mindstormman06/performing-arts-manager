Feature: Show Scheduling and Security
  As a Stage Manager
  I want to securely schedule rehearsals and events
  So that the cast and crew know where to be, and unauthorized users cannot alter the schedule

  Scenario: A Stage Manager successfully schedules a rehearsal
    Given the user "aidenadzich@gmail.com" is logged in
    And they have the "stage-manager" role
    When they attempt to create a "Tech Rehearsal" event for Rock of Ages on "2026-10-15" from "18:00" to "21:00"
    Then the API should return a "201 Created" status
    And the event should be saved successfully

  Scenario: A Stage Manager assigns cast members to an event
    Given the user "aidenadzich@gmail.com" is logged in
    And a schedule event with ID 4 exists for Rock of Ages
    When they assigned user ID 3 to event ID 4
    Then the API should return a "200 OK" status
    And the response should contain the assigned user data

  Scenario: Security blocks unauthenticated scheduling
    Given no user is logged in
    When they attempt to create a "Secret Rehearsal" event for Rock of Ages on "2026-10-15" from "18:00" to "21:00"
    Then the API should return a "400 Bad Request" status

  Scenario: Security blocks unauthenticated deletions
    Given no user is logged in
    And a schedule event with ID 4 exists for Rock of Ages
    When they attempt to delete the schedule event with ID 4 for Rock of Ages
    Then the API should return a "400 Bad Request" status