*** Settings ***
Library    Browser
Library    OperatingSystem

*** Variables ***
${URL}     http://localhost:5173/login
${EMAIL}   sarah@example.com
${PASS}    password123

*** Test Cases ***
Production Team Verifies Show Assets
    [Documentation]    Ensure the production team can accurately track physical inventory assigned to a specific show.
    Given The President is logged in
    When They access the inventory list for "Rock of Ages"
    Then The prop "Fake Electric Guitar" should be accounted for in the system

*** Keywords ***
The President is logged in
    New Browser    browser=chromium    headless=False    slowMo=0.5s
    New Context
    New Page       ${URL}
    Fill Text      input[placeholder="Email"]       ${EMAIL}
    Fill Text      input[placeholder="Password"]    ${PASS}
    Click          button:has-text("Login")

They access the inventory list for "Rock of Ages"
    Wait For Elements State    text=Cowichan Valley Players    visible
    Click                      text=Cowichan Valley Players
    Wait For Elements State    text=Rock of Ages    visible
    Click                      text=Rock of Ages
    Click                      text=Inventory

The prop "${PROP_NAME}" should be accounted for in the system
    Wait For Elements State    text=${PROP_NAME}    visible