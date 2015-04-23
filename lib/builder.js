'use strict';

function plural(token) {
  return /s$/.test(token) ? token : token + 's';
}

function addBlock(parent, token) {
  var block = {};
  var key = plural(token.key);
  if(token.value) {
    parent[key] = parent[key] || {};
    parent[key][token.value] = block;
  } else {
    parent[key] = parent[key] || [];
    parent[key].push(block);
  }
  return block;
}

function vocab(tokens) {
  var obj = {};
  var parents = [];
  var parent = obj;

  tokens.forEach(function(token) {
    switch(token.type) {
      case 'PAIR':
        var value;
        if(parent[token.key]) {
          value = parent[token.key];
          if(!Array.isArray(value)) value = [ value ];
          value.push(token.value);
        } else {
          value = token.value;
        }
        parent[token.key] = value;
        break;
      case 'BLOCK':
        parents.push(parent);
        parent = addBlock(parent, token);
        break;
      case 'CLOSE':
        parent = parents.pop();
    }
  });

  return obj;
}

function leadsheet(tokens) {
  var obj = {};
  var parent = obj;
  var part = null;

  tokens.forEach(function(token) {
    switch(token.type) {
      case 'PAIR':
        parent[token.key] = token.value;
        break;
      case 'BLOCK':
        parent = addBlock(obj, token);
        if(token.key == 'part') part = parent;
        break;
      case 'LIT':
        part.lit = part.lit || "";
        part.lit += token.value;
    }
  });
  return obj;
}

module.exports = {
  leadsheet: leadsheet,
  vocab: vocab
};
