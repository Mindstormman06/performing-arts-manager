export default {
    paths: ['tests/bdd/features/**/*.feature'],

    import: ['tests/bdd/steps/**/*.js'],

    format: ['progress', 'html:reports/cucumber-report.html'],

    publishQuiet: true
};