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

block({
  name: 'set_text',
  args: ['any', 'color'],
  func: args => {
    return {
      "block_class": "method",
      "type": 40,
      "description": "Set Text",
      "parameters": [
        {
          "value": args[0],
          "defaultValue": "",
          "key": "to",
          "type": 53,
          datum: args[0]
        },
        {
          "value": args[1],
          "key": "color",
          "type": 44
        }
      ]
    }
  }
})
