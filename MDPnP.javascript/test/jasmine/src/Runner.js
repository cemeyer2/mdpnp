/**
 * Runner
 *
 * @constructor
 * @param {jasmine.Env} env
 */
jasmine.Runner = function(env) {
  jasmine.ActionCollection.call(this, env);

  this.suites = this.actions;
};
jasmine.util.inherit(jasmine.Runner, jasmine.ActionCollection);

jasmine.Runner.prototype.finishCallback = function() {
  if (this.env.reporter) {
    this.env.reporter.reportRunnerResults(this);
  }
};

jasmine.Runner.prototype.getResults = function() {
  var results = new jasmine.NestedResults();
  for (var i = 0; i < this.suites.length; i++) {
    results.rollupCounts(this.suites[i].getResults());
  }
  return results;
};
