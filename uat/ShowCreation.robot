*** Settings ***
Library    Browser
Library    OperatingSystem

*** Variables ***
${URL}     http://localhost:5173/login
${EMAIL}   sarah@example.com
${PASS}    password123

*** Test Cases ***
President Creates Upcoming Season Show
    [Documentation]    Ensure the President can plan the upcoming season by creating a new production.
    Given The President is logged into the application
    When They navigate to the organization dashboard
    And They submit the new show form for "Anne of Green Gables"
    Then The new show "Anne of Green Gables" must be visible in the active productions list

*** Keywords ***
The President is logged into the application
    New Browser    browser=chromium    headless=False    slowMo=0.5s
    New Context
    New Page    ${URL}
    Fill Text   input[placeholder="Email"]       ${EMAIL}
    Fill Text   input[placeholder="Password"]    ${PASS}
    Click       button:has-text("Login")

They navigate to the organization dashboard
    Wait For Elements State    text=Cowichan Valley Players    visible
    Click                      text=Cowichan Valley Players

They submit the new show form for "${SHOW_TITLE}"
    Click   button[title="Add New Show"]

    Wait For Elements State    input[placeholder="e.g. The Phantom of the Opera"]    visible

    Fill Text   input[placeholder="e.g. The Phantom of the Opera"]    ${SHOW_TITLE}

    Fill Text   xpath=(//input[@type="date"])[1]    2026-05-01

    Fill Text   xpath=(//input[@type="date"])[2]    2026-06-01

    Click   button:has-text("Create Show")

The new show "${SHOW_TITLE}" must be visible in the active productions list
    Wait For Elements State    text=${SHOW_TITLE}    visible