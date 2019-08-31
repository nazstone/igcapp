const IGCAnalyzer = require('igc-analyzer');
const fs = require('fs');
const sha1 = require('sha1');

const { start, addTrace } = require('./db/repo');

start().then((db) => {
  const igcData = fs.readFileSync('/home/nazstone/Desktop/AlainVolTrace/Trace/68AGRVW1.IGC');
  const analyzer = new IGCAnalyzer(igcData);
  const lastData = analyzer.parse(true, true);

  return addTrace(lastData);
});
