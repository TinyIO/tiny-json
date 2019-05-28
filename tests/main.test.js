const { expect } = require('chai');
const { createStringify } = require('../lib');

describe('tiny.json tests', () => {
  it('Should throw if unknown type is provided', () => {
    const schemaDefinition = () =>
      createStringify({
        type: 'sting' // Typo
      });
    const schemaDefinition1 = () =>
      createStringify({
        type: 'array',
        items: {
          type: 'num' // none exist
        }
      });

    expect(schemaDefinition).to.throw();
    expect(schemaDefinition1).to.throw();
  });

  it('Should not throw if known type is provided', () => {
    const schemaDefinition = () =>
      createStringify({
        type: 'object',
        properties: {
          a: { type: 'string' },
          b: { type: 'number' },
          c: { type: 'integer' },
          d: { type: 'boolean' }
        }
      });
    const schemaDefinition1 = () =>
      createStringify({
        type: 'object',
        properties: {
          a: { type: 'array' },
          b: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                a: { type: 'boolean' },
                b: { type: 'string' },
                c: { type: 'integer' },
                d: { type: 'number' }
              }
            }
          }
        }
      });

    expect(schemaDefinition).to.not.throw();
    expect(schemaDefinition1).to.not.throw();
  });

  it('Should stringify a simple object equivalently to native JSON.stringify', () => {
    const stringify = createStringify({
      type: 'object',
      properties: {
        hello: {
          type: 'string'
        }
      }
    });

    const test = { hello: 'world' };
    const native = JSON.stringify(test);
    const tiny = stringify(test);

    expect(tiny)
      .to.be.a('string')
      .equal(native);
  });

  it('Should stringify an object with nested props equivalently to native JSON.stringify', () => {
    const stringify = createStringify({
      type: 'object',
      properties: {
        hello: { type: 'string' },
        a: { type: 'number' },
        b: { type: 'boolean' },
        c: {
          type: 'object',
          properties: {
            d: {
              type: 'object',
              properties: {
                e: { type: 'string' }
              }
            }
          }
        }
      }
    });

    const test = {
      hello: 'world',
      a: 123,
      b: false,
      c: {
        d: {
          e: 'pernacchia'
        }
      }
    };
    const native = JSON.stringify(test);
    const tiny = stringify(test);

    expect(tiny)
      .to.be.a('string')
      .equal(native);
  });

  it('Should stringify an object with typed array', () => {
    const stringify1 = createStringify({
      type: 'object',
      properties: {
        hello: { type: 'string' },
        a: {
          type: 'array',
          items: {
            type: 'boolean'
          }
        }
      }
    });

    const stringify2 = createStringify({
      type: 'object',
      properties: {
        hello: { type: 'string' },
        a: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    });

    const stringify3 = createStringify({
      type: 'object',
      properties: {
        hello: { type: 'string' },
        a: {
          type: 'array',
          items: {
            type: 'number'
          }
        }
      }
    });

    const stringify4 = createStringify({
      type: 'object',
      properties: {
        hello: { type: 'string' },
        a: {
          type: 'array',
          items: {
            type: 'integer'
          }
        }
      }
    });

    const test = {
      hello: 'world',
      a: [1, 2, 3.3, 'test', {}, [], null]
    };

    const tiny1 = stringify1(test);
    const t1 = () => JSON.parse(tiny1);
    expect(t1).to.not.throw();

    const tiny2 = stringify2(test);
    const t2 = () => JSON.parse(tiny2);
    expect(t2).to.not.throw();

    const tiny3 = stringify3(test);
    const t3 = () => JSON.parse(tiny3);
    expect(t3).to.not.throw();

    const tiny4 = stringify4(test);
    const t4 = () => JSON.parse(tiny4);
    expect(t4).to.not.throw();
  });

  it('Should stringify an object with generic array equivalently to native JSON.stringify', () => {
    const stringify = createStringify({
      type: 'object',
      properties: {
        hello: { type: 'string' },
        a: { type: 'array' }
      }
    });

    const test = {
      hello: 'world',
      a: [1, 2, 'test', new Date(), null, undefined, {}, [], { a: 1 }]
    };
    const native = JSON.stringify(test);
    const tiny = stringify(test);

    expect(tiny)
      .to.be.a('string')
      .equal(native);
  });

  it('Should stringify an object with complex typed array equivalently to native JSON.stringify', () => {
    const stringify = createStringify({
      type: 'object',
      properties: {
        a: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              b: { type: 'string' },
              c: {
                type: 'object',
                properties: {
                  d: {
                    type: 'number'
                  }
                }
              }
            }
          }
        },
        hello: { type: 'string' }
      }
    });

    const test = {
      a: [
        {
          b: 'test',
          c: {
            d: 189
          }
        },
        {
          b: 'test1',
          c: {
            d: 1892312
          }
        },
        {
          b: 'test2',
          c: {
            d: 9
          }
        },
        {
          b: 'test3',
          c: {
            d: 9.89
          }
        },
        {
          b: 'test4',
          c: {
            d: 1.323289
          }
        }
      ],
      hello: 'world'
    };
    const native = JSON.stringify(test);
    const tiny = stringify(test);

    expect(tiny)
      .to.be.a('string')
      .equal(native);
  });

  it('Should stringify a valid json when given a simple object', () => {
    const stringify = createStringify({
      type: 'object',
      properties: {
        hello: { type: 'string' }
      }
    });

    const test = { hello: 'world' };
    const tiny = stringify(test);
    const t = () => JSON.parse(tiny);

    expect(t).to.not.throw();
  });

  it('Should stringify a valid json when given a complex object', () => {
    const stringify = createStringify({
      type: 'object',
      properties: {
        hello: { type: 'string' },
        a: { type: 'number' },
        b: { type: 'boolean' },
        c: {
          type: 'object',
          properties: {
            d: {
              type: 'object',
              properties: {
                e: { type: 'string' }
              }
            }
          }
        }
      }
    });

    const test = {
      hello: 'world',
      a: 123,
      b: false,
      c: {
        d: {
          e: 'pernacchia'
        }
      }
    };

    const tiny = stringify(test);
    const t = () => JSON.parse(tiny);

    expect(t).to.not.throw();
  });

  it('Should stringify a valid json when given an object with typed array', () => {
    const stringify = createStringify({
      type: 'object',
      properties: {
        hello: { type: 'string' },
        a: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              b: { type: 'boolean' },
              c: {
                type: 'object',
                properties: {
                  d: { type: 'integer' }
                }
              }
            }
          }
        }
      }
    });

    const test = {
      hello: 'world',
      a: [
        {
          b: true,
          c: {
            d: 189
          }
        },
        {
          b: false,
          c: {
            d: 1892312
          }
        },
        {
          b: true,
          c: {
            d: 9
          }
        },
        {
          b: false,
          c: {
            d: 9.89
          }
        },
        {
          b: true,
          c: {
            d: 1.323289
          }
        }
      ]
    };

    const tiny = stringify(test);
    const t = () => JSON.parse(tiny);

    expect(t).to.not.throw();
  });

  it('Should stringify null', () => {
    const stringify = createStringify({
      type: 'object',
      properties: {
        a: { type: 'boolean' },
        b: { type: 'number' },
        c: { type: 'string' }
      }
    });

    const test = {
      a: null,
      b: null,
      c: null
    };

    const tiny = stringify(test);
    const t = () => JSON.parse(tiny);
    expect(t).to.not.throw();
  });

  it('Should stringify undefined', () => {
    const stringify = createStringify({
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'number' },
        c: { type: 'boolean' }
      }
    });

    const test = {
      a: undefined,
      b: undefined,
      c: undefined
    };

    const tiny = stringify(test);
    const t = () => JSON.parse(tiny);
    expect(t).to.not.throw();
  });

  it('Should stringify undefined wtih custom default', () => {
    const stringify = createStringify({
      type: 'object',
      properties: {
        a: { type: 'string', default: '"hi"' },
        b: { type: 'number', default: 100 },
        c: { type: 'boolean', default: false }
      }
    });

    const test = {
      a: undefined,
      b: undefined,
      c: undefined
    };

    const tiny = stringify(test);
    const t = () => JSON.parse(tiny);
    expect(t).to.not.throw();
    expect(tiny).to.equal(`{"a":"hi","b":100,"c":false}`);
  });

  it('Should stringify Dates', () => {
    const stringify = createStringify({
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'string' }
      }
    });

    const test = {
      a: new Date(),
      b: Date.now()
    };

    const tiny = stringify(test);
    const t = () => JSON.parse(tiny);
    expect(t).to.not.throw();
  });

  it('Should stringify RegExp', () => {
    const stringify = createStringify({
      type: 'object',
      properties: {
        a: { type: 'string' }
      }
    });

    const test = {
      a: new RegExp('\\n|\\r|\\t|\\"|\\\\', 'gm')
    };

    const tiny = stringify(test);
    const t = () => JSON.parse(tiny);
    expect(t).to.not.throw();
  });
});
