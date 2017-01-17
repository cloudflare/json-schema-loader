var loaderUtils = require('loader-utils');
var _ = require('lodash');
var RefParser = require('json-schema-ref-parser');

module.exports = function(source) {
  var query = loaderUtils.parseQuery(this.query);

  var callback = this.async();
  var parser = new RefParser();
  this.cacheable && this.cacheable();

  parser.dereference(query.useSource ? JSON.parse(source) : this.resourcePath)
    .then(handleResolveSuccess.bind(this))
    .catch(callback);

  function handleResolveSuccess(schema) {
    this.value = [schema];
    var json = JSON.stringify(schema, null, 2);
    _.map(parser.$refs.paths(), this.addDependency);
    callback(null, 'module.exports = ' + json + ';', schema);
  }
}
