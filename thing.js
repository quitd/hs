var stuff = {
  rules: {},
  objects: {},
  blocks: {}
}

var json = {
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
  args: ['string'],
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
              "type": 50
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

rule({
  name: 'when_object_is_tapped',
  args: ['object'], //replace with number?
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
  type: 0
})

block({
  name: 'broadcast_message',
  args: ['string'],
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
          "type": 53
        }
      ]
    }
  }
});

block({
  name: 'wait_seconds',
  args: ['string'],
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
  args: ['number'],
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
  args: ['number', 'number'],
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
//stuff

function compile(a) {
  json.uuid = new Date().getTime().toString(32)
  a.trim().replace(/\n/g, ' ').split(' ').forEach((v, i, r) => {
    if(skip > 0) {
      skip -= 1;
      return;
    }
    switch(v) {
      case 'Scene':
      if(inn.length !== 0) throw new Error('??')
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
        rules: []
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
      case 'End':
      inn.splice(-1);
    }
  });
  console.log(JSON.stringify(json));
}

function handleStuff(a, b) {
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
  console.log(d.join(' '))
  return {
    res: d.join(' '),
    add: e+1
  };
}

compile(`
  Scene scene
  Object monkey Monkey 5 5
  Rule when_game_starts
  Block wait_seconds Number 1 End
  Block broadcast_message String hi End
  End
  Rule when_i_get_message String hi End
  Block move_forward Number 300 End
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
