/**
 * Passbolt Search Command
 *
 * @copyright (c) 2019 Passbolt SA
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
const program = require('commander');
const ResourceController = require('./app/controllers/resourceController.js');
const ResourceIndexView = require('./app/views/resources/index.js');
var Coercion = require('./app/lib/coercion');

/**
 * Index.js
 */
program
  .usage('[options]', 'Search and list resources')
  .option('-u, --fingerprint <fingerprint>', 'The user key fingerprint to authenticate with')
  .option('-p, --passphrase <passphrase>', 'The key passphrase')
  .option('--columns <items>', 'Coma separated columns to display', Coercion.list)
  .option('-v, --verbose', 'Display additional debug information')
  .parse(process.argv);

const resourceController = new ResourceController(program, process.argv);
resourceController
  .loginIfNeeded()
  .then(function(){
    return resourceController.index();
  })
  .then(function(data) {
    const view = new ResourceIndexView(data, program.columns);
    view.render();
    process.exit(0);
  })
  .catch(function(err) {
    resourceController.error(err);
  });
