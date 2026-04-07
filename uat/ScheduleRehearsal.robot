*** Settings ***
Library    Browser
Library    OperatingSystem

*** Variables ***
${URL}     http://localhost:5173/login
${EMAIL}   laura@example.com
${PASS}    password123

*** Test Cases ***
Stage Manager Schedules a Rehearsal
    [Documentation]    Ensure production staff can schedule events and assign locations for the cast.
    Given The Stage Manager is logged in
    When They navigate to the scheduling dashboard for "Rock of Ages"
    And They create a new rehearsal called "Full Cast Read-Through"
    Then The event "Full Cast Read-Through" must be visible on the calendar

*** Keywords ***
The Stage Manager is logged in
    New Page       ${URL}
    Fill Text      input[placeholder="Email"]       ${EMAIL}
    Fill Text      input[placeholder="Password"]    ${PASS}
    Click          button:has-text("Login")

They navigate to the scheduling dashboard for "Rock of Ages"
    Wait For Elements State    text=Cowichan Valley Players    visible
    Click                      text=Cowichan Valley Players
    Wait For Elements State    text=Rock of Ages    visible
    Click                      text=Rock of Ages
    Click                      text=Scheduling

They create a new rehearsal called "${EVENT_TITLE}"
    Click          button[title="Create Event"]
    Wait For Elements State    text=Event Details    visible

    Fill Text      \#create-event-title         ${EVENT_TITLE}
    Fill Text      \#create-event-date          2026-11-05
    Fill Text      \#create-event-start-time    18:00
    Fill Text      \#create-event-end-time      21:00
    Fill Text      \#create-event-location      The Green Room

    Click          div.bg-white >> button:has-text("Create Event")

The event "${EVENT_TITLE}" must be visible on the calendar
    Wait For Elements State    h3:has-text("${EVENT_TITLE}")    visible
    Wait For Elements State    text=📍 The Green Room    visible