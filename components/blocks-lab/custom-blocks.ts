// Custom SAGED Blocks for Blockly

// Define custom blocks - accepts the Blockly instance to ensure proper registration
export function defineCustomBlocks(Blockly: any) {
  if (!Blockly || !Blockly.Blocks) {
    console.error('Blockly or Blockly.Blocks is not available');
    return;
  }
  
  // Check if blocks are already defined to prevent "overwrite" warnings and UI jitter
  if (Blockly.Blocks['saged_on_start']) {
    return;
  }

  // Use common namespace for Blockly utilities
  const { FieldDropdown } = Blockly;
  
  // ============================================
  // EVENT BLOCKS - Using JSON definition format
  // ============================================
  
  // Define blocks using defineBlocksWithJsonArray for better compatibility
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'saged_on_start',
      message0: '🚀 When program starts %1 do %2',
      args0: [
        { type: 'input_dummy' },
        { type: 'input_statement', name: 'DO' }
      ],
      colour: 65,
      tooltip: 'Run blocks when the program starts'
    },
    {
      type: 'saged_forever',
      message0: '🔄 Forever %1 do %2',
      args0: [
        { type: 'input_dummy' },
        { type: 'input_statement', name: 'DO' }
      ],
      colour: 65,
      tooltip: 'Repeat blocks forever'
    }
  ]);
  
  // saged_on_key needs to be defined with init function due to FieldDropdown
  if (!Blockly.Blocks['saged_on_key']) {
    Blockly.Blocks['saged_on_key'] = {
      init: function(this: any) {
        this.appendDummyInput()
          .appendField('⌨️ When')
          .appendField(new FieldDropdown([
            ['right arrow', 'ArrowRight'],
            ['left arrow', 'ArrowLeft'],
            ['up arrow', 'ArrowUp'],
            ['down arrow', 'ArrowDown'],
            ['space', 'Space'],
            ['a', 'KeyA'],
            ['d', 'KeyD'],
            ['w', 'KeyW'],
            ['s', 'KeyS'],
          ]), 'KEY')
          .appendField('key pressed');
        this.appendStatementInput('DO')
          .appendField('do');
        this.setColour(65);
        this.setTooltip('Run blocks when a key is pressed');
      }
    };
  }

  // ============================================
  // MOTION BLOCKS - Using JSON definition format
  // ============================================

  Blockly.defineBlocksWithJsonArray([
    {
      type: 'saged_move_x',
      message0: '➡️ Change X by %1',
      args0: [{ type: 'input_value', name: 'VALUE', check: 'Number' }],
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: 'Move sprite horizontally'
    },
    {
      type: 'saged_move_y',
      message0: '⬆️ Change Y by %1',
      args0: [{ type: 'input_value', name: 'VALUE', check: 'Number' }],
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: 'Move sprite vertically'
    },
    {
      type: 'saged_set_x',
      message0: '📍 Set X to %1',
      args0: [{ type: 'input_value', name: 'VALUE', check: 'Number' }],
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: 'Set sprite X position'
    },
    {
      type: 'saged_set_y',
      message0: '📍 Set Y to %1',
      args0: [{ type: 'input_value', name: 'VALUE', check: 'Number' }],
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: 'Set sprite Y position'
    },
    {
      type: 'saged_go_to',
      message0: '🎯 Go to X %1 Y %2',
      args0: [
        { type: 'input_value', name: 'X', check: 'Number' },
        { type: 'input_value', name: 'Y', check: 'Number' }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: 'Move sprite to specific position'
    },
    {
      type: 'saged_bounce',
      message0: '🏀 Bounce if on edge',
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: 'Bounce sprite if it hits the edge'
    }
  ]);

  // ============================================
  // LOOKS BLOCKS - Using JSON definition format
  // ============================================

  Blockly.defineBlocksWithJsonArray([
    {
      type: 'saged_say',
      message0: '💬 Say %1',
      args0: [{ type: 'input_value', name: 'TEXT', check: ['String', 'Number'] }],
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Display a speech bubble'
    },
    {
      type: 'saged_set_color',
      message0: '🎨 Set color to %1',
      args0: [{
        type: 'field_dropdown',
        name: 'COLOR',
        options: [
          ['red', 'red'],
          ['blue', 'blue'],
          ['green', 'green'],
          ['yellow', 'yellow'],
          ['orange', 'orange'],
          ['purple', 'purple'],
          ['pink', 'pink'],
          ['white', 'white'],
          ['black', 'black']
        ]
      }],
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Change sprite color'
    },
    {
      type: 'saged_set_size',
      message0: '📏 Set size to %1 %%',
      args0: [{ type: 'input_value', name: 'SIZE', check: 'Number' }],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Set sprite size as percentage'
    },
    {
      type: 'saged_show',
      message0: '👁️ Show',
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Make sprite visible'
    },
    {
      type: 'saged_hide',
      message0: '🙈 Hide',
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: 'Make sprite invisible'
    }
  ]);

  // ============================================
  // CONTROL BLOCKS - Using JSON definition format
  // ============================================

  Blockly.defineBlocksWithJsonArray([
    {
      type: 'saged_wait',
      message0: '⏱️ Wait %1 seconds',
      args0: [{ type: 'input_value', name: 'SECONDS', check: 'Number' }],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: 'Pause for specified seconds'
    },
    {
      type: 'saged_repeat',
      message0: '🔁 Repeat %1 times %2 %3',
      args0: [
        { type: 'input_value', name: 'TIMES', check: 'Number' },
        { type: 'input_dummy' },
        { type: 'input_statement', name: 'DO' }
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: 'Repeat blocks a number of times'
    }
  ]);

  // ============================================
  // SENSING BLOCKS - Using JSON definition format
  // ============================================

  Blockly.defineBlocksWithJsonArray([
    {
      type: 'saged_x_position',
      message0: '📐 X position',
      output: 'Number',
      colour: 290,
      tooltip: 'Current X position of sprite'
    },
    {
      type: 'saged_y_position',
      message0: '📐 Y position',
      output: 'Number',
      colour: 290,
      tooltip: 'Current Y position of sprite'
    },
    {
      type: 'saged_touching_edge',
      message0: '🔲 Touching edge?',
      output: 'Boolean',
      colour: 290,
      tooltip: 'Is sprite touching the edge?'
    }
  ]);
}

// Generate commands from workspace (instead of JS)
export function workspaceToCommands(workspace: any): any[] {
  const commands: any[] = [];
  const topBlocks = workspace.getTopBlocks(true);

  for (const block of topBlocks) {
    const command = blockToCommand(block);
    if (command) {
      commands.push(command);
    }
  }

  return commands;
}

function blockToCommand(block: any): any {
  switch (block.type) {
    case 'saged_on_start':
      return {
        type: 'ON_START',
        actions: getStatementCommands(block, 'DO'),
      };

    case 'saged_on_key':
      return {
        type: 'ON_KEY',
        key: block.getFieldValue('KEY'),
        actions: getStatementCommands(block, 'DO'),
      };

    case 'saged_forever':
      return {
        type: 'FOREVER',
        actions: getStatementCommands(block, 'DO'),
      };

    case 'saged_move_x':
      return {
        type: 'MOVE_X',
        value: getInputValue(block, 'VALUE', 10),
      };

    case 'saged_move_y':
      return {
        type: 'MOVE_Y',
        value: getInputValue(block, 'VALUE', 10),
      };

    case 'saged_set_x':
      return {
        type: 'SET_X',
        value: getInputValue(block, 'VALUE', 0),
      };

    case 'saged_set_y':
      return {
        type: 'SET_Y',
        value: getInputValue(block, 'VALUE', 0),
      };

    case 'saged_go_to':
      return {
        type: 'GO_TO',
        x: getInputValue(block, 'X', 0),
        y: getInputValue(block, 'Y', 0),
      };

    case 'saged_bounce':
      return { type: 'BOUNCE' };

    case 'saged_say':
      return {
        type: 'SAY',
        text: getInputValue(block, 'TEXT', 'Hello!'),
      };

    case 'saged_set_color':
      return {
        type: 'SET_COLOR',
        color: block.getFieldValue('COLOR'),
      };

    case 'saged_set_size':
      return {
        type: 'SET_SIZE',
        size: getInputValue(block, 'SIZE', 100),
      };

    case 'saged_show':
      return { type: 'SHOW' };

    case 'saged_hide':
      return { type: 'HIDE' };

    case 'saged_wait':
      return {
        type: 'WAIT',
        seconds: getInputValue(block, 'SECONDS', 1),
      };

    case 'saged_repeat':
      return {
        type: 'REPEAT',
        times: getInputValue(block, 'TIMES', 10),
        actions: getStatementCommands(block, 'DO'),
      };

    // Sensing Blocks
    case 'saged_x_position':
      return { type: 'X_POSITION' };

    case 'saged_y_position':
      return { type: 'Y_POSITION' };

    case 'saged_touching_edge':
      return { type: 'TOUCHING_EDGE' };

    case 'logic_compare':
      return {
        type: 'COMPARE',
        op: block.getFieldValue('OP'),
        a: getInputValue(block, 'A', 0),
        b: getInputValue(block, 'B', 0),
      };

    // Built-in Blockly blocks
    case 'math_number':
      const val = block.getFieldValue('NUM');
      return isNaN(parseFloat(val)) ? 0 : Number(val);

    case 'math_arithmetic':
      return {
        type: 'ARITHMETIC',
        op: block.getFieldValue('OP'),
        a: getInputValue(block, 'A', 0),
        b: getInputValue(block, 'B', 0),
      };

    case 'math_random_int':
      return {
        type: 'RANDOM_INT',
        from: getInputValue(block, 'FROM', 1),
        to: getInputValue(block, 'TO', 10),
      };

    case 'text':
      return block.getFieldValue('TEXT');

    case 'text_join':
      const textActions = [];
      for (let i = 0; i < (block as any).itemCount_; i++) {
        textActions.push(getInputValue(block, 'ADD' + i, ''));
      }
      return { type: 'TEXT_JOIN', parts: textActions };

    case 'controls_if':
      return {
        type: 'IF',
        condition: getInputValue(block, 'IF0', false),
        then: getStatementCommands(block, 'DO0'),
        else: getStatementCommands(block, 'ELSE'),
      };

    default:
      return null;
  }
}

function getStatementCommands(block: any, name: string): any[] {
  const commands: any[] = [];
  let childBlock = block.getInputTargetBlock(name);
  
  while (childBlock) {
    const command = blockToCommand(childBlock);
    if (command) {
      commands.push(command);
    }
    childBlock = childBlock.getNextBlock();
  }
  
  return commands;
}

function getInputValue(block: any, name: string, defaultValue: any): any {
  const inputBlock = block.getInputTargetBlock(name);
  if (!inputBlock) return defaultValue;
  
  const command = blockToCommand(inputBlock);
  return command !== null ? command : defaultValue;
}
