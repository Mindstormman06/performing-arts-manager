*** Settings ***
Library    Browser
Library    OperatingSystem

*** Variables ***
${URL}     http://localhost:5173/login
${EMAIL}   aiden.hughes@example.com
${PASS}    password123

*** Test Cases ***
Stage Manager Schedules a Rehearsal
    [Documentation]    Ensure production staff can schedule events and assign locations for the cast.
    Given The Stage Manager is logged in
    When They navigate to the scheduling dashboard for "Santa in Space"
    And They create a new rehearsal called "UAT Blocking Session"
    Then The event "UAT Blocking Session" must be visible on the calendar

*** Keywords ***
The Stage Manager is logged in
    New Page       ${URL}
    Fill Text      input[placeholder="Email"]       ${EMAIL}
    Fill Text      input[placeholder="Password"]    ${PASS}
    Click          button:has-text("Login")

They navigate to the scheduling dashboard for "Santa in Space"
    Wait For Elements State    text=Shawnigan Players    visible
    Click                      text=Shawnigan Players
    Wait For Elements State    text=Santa in Space    visible
    Click                      text=Santa in Space
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