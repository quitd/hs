var stuff = {
  rules: {},
  objects: {}
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

var inString = false;
var skip = 0;
var inn = [];

function rule(args) {
  stuff.rules[args.name] = args;
}

function object(args) {
  stuff.objects[args.name] = args;
}

//stuff
rule({
  name: 'when_game_starts',
  args: [],
  type: 6000
});

object({
  name: 'monkey',
  type: 0
})
//stuff

function compile(a) {
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
      objnames.push(name);
      json.scenes[inn[inn.length-1].index].objects.push(id);
      skip += 4;
      inn.push({
        index: Object.keys(json.objects).length,
        type: 'object'
      });
      break;
      case 'End':
      inn.splice(-1);
    }
  });
  console.log(JSON.stringify(json));
}

compile(`
  Scene Test
  Object monkey test 1 2
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
