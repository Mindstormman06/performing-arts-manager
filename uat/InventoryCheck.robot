*** Settings ***
Library    Browser
Library    OperatingSystem

*** Variables ***
${URL}     http://localhost:5173/login
${EMAIL}   levitybill@gmail.com
${PASS}    password123

*** Test Cases ***
Production Team Verifies Show Assets
    [Documentation]    Ensure the production team can accurately track physical inventory assigned to a specific show.
    Given The President is logged in
    When They access the inventory list for "Santa in Space"
    Then The prop "Prop Space Blaster" should be accounted for in the system

*** Keywords ***
The President is logged in
    New Page       ${URL}
    Fill Text      input[placeholder="Email"]       ${EMAIL}
    Fill Text      input[placeholder="Password"]    ${PASS}
    Click          button:has-text("Login")

They access the inventory list for "Santa in Space"
    Wait For Elements State    text=Shawnigan Players    visible
    Click                      text=Shawnigan Players
    Wait For Elements State    text=Santa in Space    visible
    Click                      text=Santa in Space
    Click                      text=Inventory

The prop "${PROP_NAME}" should be accounted for in the system
    Wait For Elements State    text=${PROP_NAME}    visible