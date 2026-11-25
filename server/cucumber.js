/**
 * Cucumber.js configuration for the BDD suite.
 *
 * @remarks
 * Runs the feature files in `tests/bdd/features` with step definitions from
 * `tests/bdd/steps`, prints progress, and writes an HTML report to
 * `reports/cucumber-report.html`.
 */

export default {
	paths: ["tests/bdd/features/**/*.feature"],

	import: ["tests/bdd/steps/**/*.js"],

	format: ["progress", "html:reports/cucumber-report.html"],

	publishQuiet: true,
};
