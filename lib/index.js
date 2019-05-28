'use strict';

let fullPath = 'o';
let beginChunk = true;

const genProperty = (propName, exp) =>
  propName ? `${beginChunk ? '' : "+',"}"${propName}":'+ ${exp}` : exp;

const genArray = (propName, cfg) => {
  let exp = '';
  const schema = cfg.items;
  const curPath = fullPath;
  if (schema) {
    fullPath = 'v';
    exp = propName ? (beginChunk ? '"' : '+\',"') + propName + '":[\'+' : "'['+";
    beginChunk = true;
    exp += `${curPath}.map((v) => ${genStringify('', schema)}).join(',')`;
    exp += `+']'`;
    fullPath = curPath;
  } else {
    exp = genProperty(propName, `JSON.stringify(${curPath})`);
    beginChunk = false;
  }
  return exp;
};

const genObject = (propName, cfg) => {
  let exp = '';
  exp = propName ? (beginChunk ? '"' : '+\',"') + propName + '":{' : "'{";
  beginChunk = false;
  const properties = cfg.properties;
  const cur = fullPath;
  beginChunk = true;
  for (const key in properties) {
    fullPath = `${cur}.${key}`;
    exp += genStringify(key, properties[key]);
  }
  exp += `+'}'`;
  return exp;
};

const genStringify = (propName, cfg) => {
  const type = cfg.type;
  const defaultVal = cfg.hasOwnProperty('default') ? cfg.default : 'null';
  let exp = '';
  switch (type) {
    case 'array':
      exp = genArray(propName, cfg);
      break;
    case 'boolean':
      exp = genProperty(propName, `(t=${fullPath},t==null?'${defaultVal}':!!(t))`);
      beginChunk = false;
      break;
    case 'integer':
      exp = genProperty(propName, `(t=parseInt(${fullPath}),isFinite(t)?t:'${defaultVal}')`);
      beginChunk = false;
      break;
    case 'number':
      exp = genProperty(propName, `(t=parseFloat(${fullPath}),isFinite(t)?t:'${defaultVal}')`);
      beginChunk = false;
      break;
    case 'object':
      exp = genObject(propName, cfg);
      break;
    case 'string':
      exp = genProperty(
        propName,
        `(t=${fullPath},(t==null?'${defaultVal}':'"'+(t.toJSON?t.toJSON():t)+'"'))`
      );
      beginChunk = false;
      break;
    default:
      throw new Error(`unkown type: ${type}`);
  }

  return exp;
};

const createStringify = schema => {
  fullPath = 'o';
  beginChunk = true;

  const code = `let t = null; return ${genStringify('', schema)}`;
  return new Function('o', code);
};

module.exports = {
  createStringify
};
