var stuff = {
  rules: {},
  objects: {},
  blocks: {},
  variables: {},
  bl2s: {}
}

var json = {
  playerVersion: "1.5.0",
  baseObjectScale: 1,
  customObjects: [],
  variables: [],
  eventParameters: [],
  fontSize: 80,
  scenes: [],
  version: 32,
  requires_beta_editor: false,
  abilities: [],
  rules: [],
  customRules: [],
  traits: [],
  objects: [],
  stageSize: {
    width: 1024,
    height: 768
  },
  playerUpgrades: {},
  uuid: 'test',
  author: 'me',
  deleted_at: null,
  edited_at: null,
  filename: 'aaa',
  text_object_label: null,
  title: 'Hello World!',
  has_been_removed: false,
  in_moderation: false,
  remote_asset_urls: []
}

var objnames = [];

var skip = 0;
var inn = [];

function rule(args) {
  stuff.rules[args.name] = args;
}

function object(args) {
  stuff.objects[args.name] = args;
}

function block(ar) {
  stuff.blocks[ar.name] = ar;
}

function bl2(arg) {
  stuff.bl2s[arg.name] = arg;
}

//stuff
rule({
  name: 'when_game_starts',
  args: [],
  parameters: () => {
    return [
      {
        "datum": {
          "type": 7000,
          "block_class": "operator"
        },
        "key": "",
        "value": "",
        "defaultValue": "",
        "type": 52
      }
    ]
  }
});

rule({
  name: 'when_i_get_message',
  args: ['any'],
  parameters: arg => {
    return [
      {
        "datum": {
          "block_class": "operator",
          "type": 7023,
          "description": "",
          "params": [
            {
              "defaultValue": "",
              "value": arg[0]||null,
              "key": "",
              "type": 50,
              datum: arg[0]||null
            }
          ]
        },
        "key": "",
        "value": "",
        "defaultValue": "",
        "type": 52
      }
    ]
  }
})

rule({ //TODO: fix this
  name: 'when_object_is_tapped',
  args: ['object'],
  parameters: arg => {
    var h;
    json.objects.forEach(v => {
      if(v.name === arg[0]) h = v.objectID;
    });
    return [
      {
        "datum": {
          "block_class": "operator",
          "type": 7001,
          "description": "is Tapped",
          "params": [
            {
              "defaultValue": "",
              "value": "",
              "key": "",
              "type": 50,
              "variable": h||null
            }
          ]
        },
        "key": "",
        "value": "",
        "defaultValue": "",
        "type": 52
      }
    ]
  }
})

object({
  name: 'monkey',
  type: 0,
  filename: 'monkey.png'
})

block({
  name: 'broadcast_message',
  args: ['any'],
  //TODO: variable thing later
  func: (arg) => {
    return {
      "block_class": "method",
      "type": 126,
      "description": "",
      "parameters": [
        {
          "value": arg[0]||"100",
          "defaultValue": "",
          "key": "named",
          "type": 53,
          datum: arg[0]||null
        }
      ]
    }
  }
});

block({
  name: 'wait_seconds',
  args: ['any'],
  func: args => {
    return {
      "block_class": "method",
      "type": 61,
      "description": "Wait",
      "parameters": [
        {
          "value": args[0],
          "defaultValue": "",
          "key": "seconds",
          "type": 57
        }
      ]
    }
  }
})

block({
  name: 'move_forward',
  args: ['any'],
  func: (arg) => {
    return {
      "block_class": "method",
      "type": 23,
      "description": "Move Forward",
      "parameters": [
        {
          "value": arg[0]||"100",
          "defaultValue": "",
          "key": "",
          "type": 57
        }
      ]
    }
  }
})

block({
  name: 'set_position',
  args: ['any', 'any'],
  func: args => {
    return {
      "block_class": "method",
      "description": "Set Position",
      "type": 41,
      "parameters": [
        {
          "value": args[0],
          "defaultValue": "",
          "key": "to x",
          "type": 57
        },
        {
          "value": args[1],
          "defaultValue": "",
          "key": "y",
          "type": 57
        }
      ]
    }
  }
})

block({
  name: 'set_variable',
  args: ['variable', 'any'],
  func: args => {
    return {
      "block_class": "method",
      "description": "Set",
      "type": 45,
      "parameters": [
        {
          "defaultValue": "",
          "value": "",
          "key": "",
          "datum": args[0],
          "type": 47
        },
        {
          "defaultValue": "10",
          "value": args[1],
          "key": "to",
          datum: args[1],
          "type": 48
        }
      ]
    }
  }
})

bl2({
  name: 'repeat_forever',
  args: [],
  func: (ar, id) => {
    return {
      "block_class": "control",
      "description": "Repeat Forever",
      "controlScript": {
        "abilityID": id
      },
      "type": 121
    }
  }
})

block({
  name: 'change_y',
  args: ['any'],
  func: arg => {
    return {
      "block_class": "method",
      "description": "Change Y by",
      "type": 28,
      "parameters": [
        {
          "value": arg[0]||'100',
          "defaultValue": "",
          "key": "",
          "type": 57,
          datum: arg[0]||'100'
        }
      ]
    }
  }
});

block({
  name: 'change_x',
  args: ['any'],
  func: arg => {
    return {
      "block_class": "method",
      "description": "Change X by",
      "type": 27,
      "parameters": [
        {
          "value": arg[0]||'100',
          "defaultValue": "",
          "key": "",
          "type": 57,
          datum: arg[0]||'100'
        }
      ]
    }
  }
})
//stuff

function compile(a) {
  var chk = false;
  json.uuid = new Date().getTime().toString(32)
  a.trim().replace(/\n/g, ' ').split(' ').forEach((v, i, r) => {
    if(skip > 0) {
      skip -= 1;
      return;
    }
    switch(v) {
      case 'Scene':
      if(inn.length !== 0) throw new Error('??')
      chk = true;
      inn.push({
        index: Object.keys(json.scenes).length,
        type: 'scene'
      });
      json.scenes.push({
        name: r[i+1],
        objects: []
      });
      skip += 1;
      break;
      case 'Object':
      if((inn[inn.length-1]||{type: 'aa'}).type !== 'scene') throw new Error('You must add objects in a scene.');
      if(objnames.includes(r[i+2])) throw new Error('Cannot have 2 objects with the same name!')
      var id = pleaseGiveMeSomeRandom()
      json.objects.push({
        resizeScale: 1,
        type: stuff.objects[r[i+1]].type,
        name: r[i+2],
        xPosition: +r[i+3],
        yPosition: +r[i+4],
        objectID: id,
        rules: [],
        filename: stuff.objects[r[i+1]].filename,
        width: 100,
        height: 100
      });
      objnames.push(r[i+2]);
      json.scenes[inn[inn.length-1].index].objects.push(id);
      skip += 4;
      inn.push({
        index: json.objects.length-1,
        type: 'object'
      });
      break;
      case 'Rule':
      if((inn[inn.length-1]||{type: 'aa'}).type !== 'object') throw new Error('You must add rules in an object.');
      var id = pleaseGiveMeSomeRandom();
      var skipp = 1;
      var args = [];
      var num = 2;
      stuff.rules[r[i+1]].args.forEach(v => {
        var thing = handleStuff(r, i+num, v)
        args.push(thing.res);
        num+=thing.add;
        skipp+=thing.add;
        inn.splice(-1);
      })
      var anotherRand = pleaseGiveMeSomeRandom();
      json.rules.push({
        objectID: json.objects[inn[inn.length-1].index].objectID,
        id,
        name: '',
        ruleBlockType: 6000,
        type: 6000,
        parameters: stuff.rules[r[i+1]].parameters(args)||[],
        abilityID: anotherRand
      });
      json.abilities.push({
        abilityID: anotherRand,
        blocks: [],
        createdAt: 0
      });
      json.objects[inn[inn.length-1].index].rules.push(id);
      inn.push({
        index: json.rules.length - 1,
        type: 'rule',
        abilindex: json.abilities.length - 1
      });
      skip += skipp;
      break;
      case 'Block':
      var skipp = 1;
      var num = 2;
      var args = [];
      stuff.blocks[r[i+1]].args.forEach(v => {
        var thing = handleStuff(r, i+num, v)
        args.push(thing.res);
        num+=thing.add;
        skipp+=thing.add;
        inn.splice(-1);
      });
      json.abilities[inn[inn.length - 1].abilindex].blocks.push(stuff.blocks[r[i+1]].func(args));
      skip += skipp;
      break;
      case 'Var':
      if(inn.length > 0) throw new Error('You must declare variables outside anything.');
      if(chk) throw new Error('Declare variables before doing something else.');
      if(r[i+1] in stuff.variables) throw new Error('You cannot redeclare a variable.');
      json.variables.push({
        name: r[i+1],
        type: 8003,
        objectIdString: pleaseGiveMeSomeRandom()
      });
      stuff.variables[r[i+1]] = json.variables.length - 1;
      break;
      case 'Block2':
      var skipp = 1;
      var num = 2;
      var args = [];
      stuff.bl2s[r[i+1]].args.forEach(v => {
        var thing = handleStuff(r, i+num, v)
        args.push(thing.res);
        num+=thing.add;
        skipp+=thing.add;
        inn.splice(-1);
      });
      var id = pleaseGiveMeSomeRandom();
      json.abilities[inn[inn.length - 1].abilindex].blocks.push(stuff.bl2s[r[i+1]].func(args, id));
      json.abilities.push({
        abilityID: id,
        blocks: [],
        createdAt: 0
      })
      inn.push({
        index: json.abilities.length - 1,
        type: 'bl2',
        abilindex: json.abilities.length - 1
      });
      skipp += skip;
      break;
      case 'End':
      inn.splice(-1);
    }
  });
  console.log(JSON.stringify(json));
}

function handleStuff(a, b, c) {
  if(a[b] == 'Variable') {
    inn.push({
      type: 'var'
    });
    return {
      res: {
        "type": 8003,
        "variable": json.variables[stuff.variables[a[b+1]]].objectIdString,
        "description": "Variable"
      },
      add: 3
    }
  } else {
    if(c == 'variable') throw new Error('??')
    inn.push({
      type: 'thing'
    });
    var d = [];
    var e = 1;
    for(var x=0;x==x;e++) {
      if(a[b+e] == 'End') {
        break;
      } else {
        d.push(a[b+e]);
      }
    }
    return {
      res: d.join(' '),
      add: e+1
    };
  }
}

compile(`
  Var testvar
  Var test2
  Scene scene
  Object monkey Monkey 200 100
  Rule when_game_starts
  Block set_variable Variable testvar End Number 15 End
  Block wait_seconds Number 1 End
  Block broadcast_message Variable testvar End
  End
  Rule when_i_get_message Number 15 End
  Block move_forward Number 300 End
  End
  End
  Object monkey Monkey2 300 50
  Rule when_game_starts
  Block set_variable Variable test2 End Number -50 End
  Block2 repeat_forever
  Block change_x Number 50 End
  Block wait_seconds Number 1 End
  Block change_y Number 50 End
  Block wait_seconds Number 1 End
  Block change_x Number -50 End
  Block wait_seconds Number 1 End
  Block change_y Variable test2 End
  Block wait_seconds Number 1 End
  End
  End
  End
  End
  `)



  function pleaseGiveMeSomeRandom() {
    var a = '';
    for(var e=0;e<13;e++) {
      a+=Math.floor(Math.random() * 9);
    }
    return a;
  }
