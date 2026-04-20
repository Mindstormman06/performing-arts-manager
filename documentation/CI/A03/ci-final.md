# ITAS276 Assignment #3
### Aiden Adzich
---

## SCA
To start out in the construction of my final CI pipeline, I added an NPM audit task to my SCA step, as I found that it would catch things RetireJS would not. <br>
I then duplicated my server-security step and applied it to the client as well. <br>
My 2 SCA tests remained after linting for most of the project and only moved during the final restructuring.

## Linting
I ended up leaving linting exactly as it was. Biome running first on both the server and client, with ESLint afterwards to catch anything it missed. <br>
These jobs have always run in parallel as the first step, and remain that way in the final version.

## SAST
After a bit of research, I settled on [SemGrep](https://github.com/semgrep/semgrep) for my SAST tool. This seemed best suited for my needs as it was simple, lightweight, and highly recommended online.
SemGrep was placed to run in parallel with my linting right at the start of the pipeline. It scans both the server and the client.

## Unit Testing
Nothing was changed about the unit testing for the final version of the pipeline. <br> 
A few additions were made to bring coverage up to 80%, but it still remains in the same place in the pipeline and uses the same tools.

## UI Testing
Much like unit testing, this was mostly unchanged. The only difference was having to update some tests to match changes made in the UI. <br>
It remains running parallel with unit testing as it always was.

## BDD Tests
Another part of the pipeline that remained incredibly similar to when it was first added. <br>
Primary changes were updating credentials to match new seed data. <br>
BDD remained running after completion of server unit tests for most of the project, only being moved during the final restructure.

## UAT Tests
UAT tests ended up being a massive headache. I wrote all my tests using robot framework earlier on in Assignment 2, and got everything working properly locally, but in the pipeline it never worked. <br>
After a lot of troubleshooting involving rewriting the start script repeatedly (and help from Gemini when I hit a wall), I finally got the UAT tests running for the final version of the pipeline. <br>
UAT runs in parallel with BDD, after the unit and UI tests have passed.

## DAST Tests
For DAST I settled on OWASP ZAP, as it is probably the most I've heard the most about, and it seemed quite simple to get running in a pipeline compared to the alternatives. <br>
Initially I had placed this to run in parallel with BDD and UAT, but given it was the heaviest and longest running task, I realized it would be best to leave it as the absolute last thing (other than build and deploy) to run in the pipeline.

## Build
For the final pipeline, I added a client build step to run in parallel with the server build, resulting in 2 separate Docker containers. <br>
The build steps run after DAST completes.

## Deploy
The Docker deploy step was updated to include logging into DockerHub, and pushing the images to a private repository. <br>
Due to DockerHub's limit of 1 private repo, I had to push the images under the same name, but with different tags. <br>
This is the last step of the pipeline

## Updating
While working on the final version, I made sure to update all of my out-of-date actions, which got rid of all but 1 version warning during the run on GitHub. <br>
As of 04/20/26 all actions are updated to their most recent versions.

## Final Restructure
The order of the pipeline changed a lot throughout the final stretch, and kept changing right up into writing this final bit of the report. <br>
The final changes were moving SCA to run in parallel with linting and SAST at the start of the pipeline, moving UAT and run in parallel with BDD, and moving DAST to run right before the builds. <br>
<br>This splits the pipeline up into 6 stages: <br>
Stage 1 (Static Analysis):
- Linting (BiomeJS, ESLint)
- SCA (RetireJS, NPM Audit)
- SAST (SemGrep)

Stage 2 (Unit/UI Tests):
- Server Unit Tests (vitest)
- Client UI Tests (Playwright)

Stage 3 (Integration Testing):
- BDD Tests (Cucumber)
- UAT Tests (Robot Framework)

Stage 4 (DAST):
- DAST Full Scan (OWASP ZAP)

Stage 5 (Building):
- Client & Server Image builds

Stage 6 (Deploy):
- Deploy to DockerHub