/* eslint-disable no-unused-vars */

const fs = require('fs');

var stuff = {
  rules: {},
  objects: {},
  blocks: {},
  variables: {},
  bl2s: {},
  customabilities: {},
  objs: {}
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

//blocks and stuff
eval(fs.readFileSync('hs.js', 'utf8'));

function compile(a) {
  var chk = {
    var: false,
    abi: false
  };
  json.uuid = new Date().getTime().toString(32)
  a.trim().replace(/\n/g, ' ').split(' ').forEach((v, i, r) => {
    var id, skipp, num, args;
    if(skip > 0) {
      skip -= 1;
      return;
    }
    switch(v) {
      case 'Scene':
      if(inn.length !== 0) throw new Error('??')
      chk.var = chk.abi = true;
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
      id = pleaseGiveMeSomeRandom()
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
      var ep = pleaseGiveMeSomeRandom();
      json.eventParameters.push({
        id: ep,
        objectID: id,
        description: 'Object',
        blockType: 8000
      });
      objnames.push(r[i+2]);
      json.scenes[inn[inn.length-1].index].objects.push(id);
      skip += 4;
      inn.push({
        index: json.objects.length-1,
        type: 'object'
      });
      stuff.objs[r[i+2]] = {
        index: json.objects.length - 1,
        ep
      };
      break;
      case 'Rule':
      if((inn[inn.length-1]||{type: 'aa'}).type !== 'object') throw new Error('You must add rules in an object.');
      id = pleaseGiveMeSomeRandom();
      skipp = 1;
      args = [];
      num = 2;
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
      skipp = 1;
      num = 2;
      args = [];
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
      if(inn.length > 0) throw new Error('You must create variables outside anything.');
      if(chk.var) throw new Error('Create variables before doing something else.');
      if(r[i+1] in stuff.variables) throw new Error('You cannot re-create a variable.');
      json.variables.push({
        name: r[i+1],
        type: 8003,
        objectIdString: pleaseGiveMeSomeRandom()
      });
      stuff.variables[r[i+1]] = json.variables.length - 1;
      skip += 1;
      break;
      case 'Block2':
      skipp = 1;
      num = 2;
      args = [];
      stuff.bl2s[r[i+1]].args.forEach(v => {
        var thing = handleStuff(r, i+num, v)
        args.push(thing.res);
        num+=thing.add;
        skipp+=thing.add;
        inn.splice(-1);
      });
      id = pleaseGiveMeSomeRandom();
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
      skip += skipp;
      break;
      case 'Custom_Ability':
      chk.var = true;
      if(inn.length > 0) throw new Error('You must create custom abilities outside anything.');
      if(chk.abi) throw new Error('Create custom abilities before doing something else.');
      if(r[i+1] in stuff.customabilities) throw new Error('You cannot re-create a custom ability.');
      json.abilities.push({
        blocks: [],
        createdAt: 0,
        abilityID: pleaseGiveMeSomeRandom()
      });
      stuff.customabilities[r[i+1]] = json.abilities.length - 1;
      inn.push({
        type: 'ca',
        index: json.abilities.length - 1,
        abilindex: json.abilities.length - 1
      })
      skip += 1;
      break;
      case 'Ability':
      json.abilities[inn[inn.length - 1].abilindex].blocks.push({
        "block_class": "control",
        "description": r[i+1],
        "type": 123,
        "controlScript": {
          "abilityID": json.abilities[stuff.customabilities[r[i+1]]].abilityID
        }
      });
      skip += 1;
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
  } else if(a[b] == 'Color') {
    if(c !== 'color') throw new Error('??');
    inn.push({
      type: 'thing'
    });
    var hsb = [];
    for(var x=0;x<3;x++) {
      hsb.push(a[b+x+1]);
    }
    return {
      res: `HSB(${hsb.join(',')})`,
      add: 5
    }
  } else if(a[b] == 'Obj') {
    if(c !== 'object') throw new Error('??');
    inn.push({
      type: 'obj'
    })
    return {
      res: stuff.objs[a[b+1]].ep,
      add: 3
    }
  } else {
    if(['variable', 'color'].includes(c)) throw new Error('??')
    inn.push({
      type: 'thing'
    });
    var d = [];
    var e = 1;
    for(var y=0;y==y;e++) {
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
  Custom_Ability ability
  Block change_y Number 300 End
  End
  Custom_Ability changetext
  Block set_text Variable testvar End Color 50 60 90 End
  End
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
  Object monkey Monkey3 600 40
  Rule when_game_starts
  Block wait_seconds Number 3 End
  Ability ability
  Block wait_seconds Number 1.5 End
  Ability changetext
  End
  End
  Object square Square 20 100
  Rule when_object_is_tapped Obj Monkey2 End
  Block grow Variable testvar End
  End
  Rule when_game_is_playing
  Block set_color Color 80 400 222 End
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
