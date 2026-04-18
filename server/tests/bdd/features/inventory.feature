Feature: Equipment Inventory Management
  As a Technical Director
  I want to manage the inventory of equipment for productions
  So that I can ensure we have the necessary resources for rehearsals and performances

  Scenario: Viewing the show inventory
    Given the user "aidenadzich@gmail.com" is logged in
    And they have the "tech" role
    When they request the show inventory for Rock of Ages
    Then the API should return a "200 OK" status
    And the response should contain a list of inventory items

  Scenario: Adding a newly purchased inventory item to the show
    Given the user "aidenadzich@gmail.com" is logged in
    And they have the "tech" role
    When they attempt to add a "Lapel Microphone" to the "Tech" department in the show inventory
    Then the API should return a "201 Created" status
    And the item should be saved successfully

  Scenario: Assigning global equipment to a specific show
    Given the user "aidenadzich@gmail.com" is logged in
    And an inventory item with ID 24 exists
    When they pull inventory item ID 24 for Rock of Ages
    Then the API should return a "200 OK" status

  Scenario: Security blocks unauthorized inventory management
    Given the user "lilyparker25@outlook.com" is logged in
    And they have the "actor" role
    When they attempt to add a "Smoke Machine" to the "Tech" department in the show inventory
    Then the API should return a "403 Forbidden" status