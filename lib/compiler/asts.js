"use strict";

let visitor = require("./visitor");

// AST utilities.
let asts = {
  findRule(ast, name) {
    for (let i = 0; i < ast.rules.length; i++) {
      let rule = ast.rules[i]
      // console.log('rule', rule)
      if (rule.name === name) {
        console.log('rule found for', name, rule)
        return rule;
      }
    }
    console.log('no rule found', name)
    return undefined;
  },

  indexOfRule(ast, name) {
    for (let i = 0; i < ast.rules.length; i++) {
      if (ast.rules[i].name === name) {
        return i;
      }
    }

    return -1;
  },

  alwaysConsumesOnSuccess(ast, node) {
    function consumesTrue() {
      return true;
    }

    function consumesFalse() {
      return false;
    }

    function consumesExpression(node) {
      return consumes(node.expression);
    }

    let consumes = visitor.build({
      rule: consumesExpression,
      named: consumesExpression,

      choice(node) {
        return node.alternatives.every(consumes);
      },

      action: consumesExpression,

      sequence(node) {
        return node.elements.some(consumes);
      },

      labeled: consumesExpression,
      text: consumesExpression,
      simple_and: consumesFalse,
      simple_not: consumesFalse,
      optional: consumesFalse,
      zero_or_more: consumesFalse,
      one_or_more: consumesExpression,
      group: consumesExpression,
      semantic_and: consumesFalse,
      semantic_not: consumesFalse,

      rule_ref(node) {
        return consumes(asts.findRule(ast, node.name));
      },

      literal(node) {
        return node.value !== "";
      },

      class: consumesTrue,
      any: consumesTrue
    });

    return consumes(node);
  }
};

module.exports = asts;