// Default toolbox configuration for Blocks Lab

export const defaultToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '🎬 Events',
      colour: '#FFAB19',
      contents: [
        { kind: 'block', type: 'saged_on_start' },
        { kind: 'block', type: 'saged_on_key' },
        { kind: 'block', type: 'saged_forever' },
      ],
    },
    {
      kind: 'category',
      name: '🚀 Motion',
      colour: '#4C97FF',
      contents: [
        { kind: 'block', type: 'saged_move_x', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'saged_move_y', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'saged_set_x', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'saged_set_y', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        {
          kind: 'block',
          type: 'saged_go_to',
          inputs: {
            X: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
            Y: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
          },
        },
        { kind: 'block', type: 'saged_bounce' },
      ],
    },
    {
      kind: 'category',
      name: '👀 Looks',
      colour: '#9966FF',
      contents: [
        { kind: 'block', type: 'saged_say', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'Hello!' } } } } },
        { kind: 'block', type: 'saged_set_color' },
        { kind: 'block', type: 'saged_set_size', inputs: { SIZE: { shadow: { type: 'math_number', fields: { NUM: 100 } } } } },
        { kind: 'block', type: 'saged_show' },
        { kind: 'block', type: 'saged_hide' },
      ],
    },
    {
      kind: 'category',
      name: '🔄 Control',
      colour: '#FF8C1A',
      contents: [
        { kind: 'block', type: 'saged_wait', inputs: { SECONDS: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
        { kind: 'block', type: 'saged_repeat', inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'saged_if' },
        { kind: 'block', type: 'saged_if_else' },
        { kind: 'block', type: 'controls_if' },
      ],
    },
    {
      kind: 'category',
      name: '📐 Sensing',
      colour: '#5CB1D6',
      contents: [
        { kind: 'block', type: 'saged_x_position' },
        { kind: 'block', type: 'saged_y_position' },
        { kind: 'block', type: 'saged_touching_edge' },
        { kind: 'block', type: 'saged_touching_object', inputs: { ID: { shadow: { type: 'text', fields: { TEXT: 'object1' } } } } },
        { kind: 'block', type: 'saged_key_pressed' },
        { kind: 'block', type: 'saged_ask', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'What is your name?' } } } } },
        { kind: 'block', type: 'saged_answer' },
      ],
    },
    {
      kind: 'category',
      name: '📦 Objects',
      colour: '#8A2BE2',
      contents: [
        {
          kind: 'block',
          type: 'saged_create_object',
          inputs: {
            X: { shadow: { type: 'math_number', fields: { NUM: 100 } } },
            Y: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
            ID: { shadow: { type: 'text', fields: { TEXT: 'food1' } } },
          },
        },
        {
          kind: 'block',
          type: 'saged_remove_object',
          inputs: {
            ID: { shadow: { type: 'text', fields: { TEXT: 'food1' } } },
          },
        },
        {
          kind: 'block',
          type: 'saged_with_object',
          inputs: {
            ID: { shadow: { type: 'text', fields: { TEXT: 'food1' } } },
          },
        },
      ],
    },
    {
      kind: 'category',
      name: '➕ Math',
      colour: '#59C059',
      contents: [
        { kind: 'block', type: 'math_number' },
        {
          kind: 'block',
          type: 'math_arithmetic',
          inputs: {
            A: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
            B: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
          },
        },
        {
          kind: 'block',
          type: 'logic_compare',
          inputs: {
            A: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
            B: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
          },
        },
        { kind: 'block', type: 'math_random_int', inputs: { FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, TO: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
      ],
    },
    {
      kind: 'category',
      name: '📝 Text',
      colour: '#CF63CF',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_join' },
      ],
    },
    {
      kind: 'category',
      name: '🔢 Variables',
      colour: '#FF8C1A',
      custom: 'VARIABLE',
    },
  ],
};

export const simpleToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '🎬 Events',
      colour: '#FFAB19',
      contents: [
        { kind: 'block', type: 'saged_on_start' },
        { kind: 'block', type: 'saged_on_key' },
      ],
    },
    {
      kind: 'category',
      name: '🚀 Motion',
      colour: '#4C97FF',
      contents: [
        { kind: 'block', type: 'saged_move_x', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'saged_move_y', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
      ],
    },
    {
      kind: 'category',
      name: '👀 Looks',
      colour: '#9966FF',
      contents: [
        { kind: 'block', type: 'saged_say', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'Hello!' } } } } },
        { kind: 'block', type: 'saged_set_color' },
      ],
    },
    {
      kind: 'category',
      name: '➕ Math',
      colour: '#59C059',
      contents: [
        { kind: 'block', type: 'math_number' },
      ],
    },
  ],
};
