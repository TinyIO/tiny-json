'use strict';

let fullPath = 'o';
let beginChunk = true;

const buildProperty = (propName, exp) =>
  propName ? `${beginChunk ? '' : "+',"}"${propName}":'+ ${exp}` : exp;
/**
 * create a special stringify base on schema
 * @param {*} schema
 */
const createStringify = schema => {
  fullPath = 'o';
  beginChunk = true;
  const genStringify = (propName, cfg) => {
    const type = cfg.type;
    const defaultVal = cfg.hasOwnProperty('default') ? cfg.default : 'null';
    let exp = '';
    switch (type) {
      case 'array':
        {
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
            exp = buildProperty(propName, `JSON.stringify(${curPath})`);
            beginChunk = false;
          }
        }
        break;
      case 'boolean':
        {
          exp = buildProperty(propName, `(t=${fullPath},t==null?'${defaultVal}':!!(t))`);
          beginChunk = false;
        }
        break;
      case 'integer':
        {
          exp = buildProperty(propName, `(t=parseInt(${fullPath}),isFinite(t)?t:'${defaultVal}')`);
          beginChunk = false;
        }
        break;
      case 'number':
        {
          exp = buildProperty(
            propName,
            `(t=parseFloat(${fullPath}),isFinite(t)?t:'${defaultVal}')`
          );
          beginChunk = false;
        }
        break;
      case 'object':
        {
          exp = propName ? (beginChunk ? '"' : '+\',"') + propName + '":{' : "'{";
          beginChunk = false;
          const properties = cfg.properties;
          const curPath = fullPath;
          beginChunk = true;
          for (const key in properties) {
            fullPath = `${curPath}.${key}`;
            exp += genStringify(key, properties[key]);
          }
          exp += `+'}'`;
        }
        break;
      case 'string':
        {
          exp = buildProperty(
            propName,
            `(t=${fullPath},(t==null?'${defaultVal}':'"'+(t.toJSON?t.toJSON():t)+'"'))`
          );
          beginChunk = false;
        }
        break;
      default:
        throw new Error(`unkown type: ${type}`);
    }

    return exp;
  };

  const code = `let t = null; return ${genStringify('', schema)}`;

  return new Function('o', code);
};

module.exports = {
  createStringify
};
