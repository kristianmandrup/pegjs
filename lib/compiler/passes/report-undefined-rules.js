"use strict";

let GrammarError = require("../../grammar-error");
let asts = require("../asts");
let visitor = require("../visitor");

// Checks that all referenced rules exist.
function reportUndefinedRules(ast) {
  console.log('reportUndefinedRules(ast)', ast)
  let check = visitor.build({
    rule_ref(node) {
      console.log('node', node)
      if (!asts.findRule(ast, node.name)) {
        console.error('oops', node)
        throw new GrammarError(
          "Rule \"" + node.name + "\" is not defined.",
          node.location
        );
      }
    }
  });

  console.log('do check')
  check(ast);
  console.log('check done')
}

module.exports = reportUndefinedRules;