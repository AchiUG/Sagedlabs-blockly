// Command interpreter for running Blockly-generated commands

export interface SpriteState {
  x: number;
  y: number;
  color: string;
  size: number;
  visible: boolean;
  message: string;
  messageTimer: number;
}

export interface StageState {
  width: number;
  height: number;
  sprites: { [key: string]: SpriteState };
  pressedKeys: Set<string>;
  running: boolean;
}

export function createInitialState(config?: any): StageState {
  return {
    width: config?.width || 480,
    height: config?.height || 360,
    sprites: {
      main: {
        x: config?.width ? config.width / 2 : 240,
        y: config?.height ? config.height / 2 : 180,
        color: config?.spriteColor || '#124734',
        size: 100,
        visible: true,
        message: '',
        messageTimer: 0,
      },
    },
    pressedKeys: new Set(),
    running: false,
  };
}

export class CommandInterpreter {
  private state: StageState;
  private commands: any[];
  private eventHandlers: Map<string, any[]>;
  private foreverLoops: any[][];
  private startActions: any[][];
  private animationFrame: number | null = null;

  constructor(commands: any[], state: StageState) {
    this.commands = commands;
    this.state = state;
    this.eventHandlers = new Map();
    this.foreverLoops = [];
    this.startActions = [];
    this.parseCommands();
  }

  private parseCommands() {
    for (const cmd of this.commands) {
      switch (cmd.type) {
        case 'ON_START':
          this.startActions.push(cmd.actions || []);
          break;
        case 'ON_KEY':
          const key = cmd.key;
          if (!this.eventHandlers.has(key)) {
            this.eventHandlers.set(key, []);
          }
          this.eventHandlers.get(key)!.push(cmd.actions || []);
          break;
        case 'FOREVER':
          this.foreverLoops.push(cmd.actions || []);
          break;
      }
    }
  }

  start(onUpdate: (state: StageState) => void) {
    this.state.running = true;
    
    // Execute start actions
    for (const actions of this.startActions) {
      this.executeActions(actions);
    }
    onUpdate(this.state);

    // Main loop
    const loop = () => {
      if (!this.state.running) return;

      // Execute forever loops
      for (const actions of this.foreverLoops) {
        this.executeActions(actions);
      }

      // Update message timers
      const sprite = this.state.sprites.main;
      if (sprite.messageTimer > 0) {
        sprite.messageTimer--;
        if (sprite.messageTimer <= 0) {
          sprite.message = '';
        }
      }

      onUpdate(this.state);
      this.animationFrame = requestAnimationFrame(loop);
    };

    this.animationFrame = requestAnimationFrame(loop);
  }

  stop() {
    this.state.running = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  handleKeyDown(code: string) {
    this.state.pressedKeys.add(code);
    const handlers = this.eventHandlers.get(code);
    if (handlers) {
      for (const actions of handlers) {
        this.executeActions(actions);
      }
    }
  }

  handleKeyUp(code: string) {
    this.state.pressedKeys.delete(code);
  }

  private executeActions(actions: any[]) {
    const sprite = this.state.sprites.main;

    for (const action of actions) {
      if (!action || typeof action !== 'object') continue;

      switch (action.type) {
        case 'MOVE_X':
          sprite.x += Number(action.value) || 0;
          break;
        case 'MOVE_Y':
          sprite.y -= Number(action.value) || 0; // Invert Y for screen coords
          break;
        case 'SET_X':
          sprite.x = Number(action.value) || 0;
          break;
        case 'SET_Y':
          sprite.y = this.state.height - (Number(action.value) || 0); // Invert Y
          break;
        case 'GO_TO':
          sprite.x = Number(action.x) || 0;
          sprite.y = this.state.height - (Number(action.y) || 0);
          break;
        case 'BOUNCE':
          this.bounceOnEdge(sprite);
          break;
        case 'SAY':
          sprite.message = String(action.text || '');
          sprite.messageTimer = 180; // ~3 seconds at 60fps
          break;
        case 'SET_COLOR':
          sprite.color = action.color || '#124734';
          break;
        case 'SET_SIZE':
          sprite.size = Math.max(10, Math.min(500, Number(action.size) || 100));
          break;
        case 'SHOW':
          sprite.visible = true;
          break;
        case 'HIDE':
          sprite.visible = false;
          break;
        case 'REPEAT':
          const times = Number(action.times) || 1;
          for (let i = 0; i < times; i++) {
            this.executeActions(action.actions || []);
          }
          break;
        case 'IF':
          if (this.evaluateCondition(action.condition)) {
            this.executeActions(action.then || []);
          } else {
            this.executeActions(action.else || []);
          }
          break;
      }
    }

    // Keep sprite in bounds
    this.constrainToBounds(sprite);
  }

  private bounceOnEdge(sprite: SpriteState) {
    const halfSize = (sprite.size / 100) * 25; // Assume 50px base sprite
    
    if (sprite.x < halfSize || sprite.x > this.state.width - halfSize) {
      // Reverse X direction - simplified bounce
      sprite.x = Math.max(halfSize, Math.min(this.state.width - halfSize, sprite.x));
    }
    if (sprite.y < halfSize || sprite.y > this.state.height - halfSize) {
      sprite.y = Math.max(halfSize, Math.min(this.state.height - halfSize, sprite.y));
    }
  }

  private constrainToBounds(sprite: SpriteState) {
    const halfSize = (sprite.size / 100) * 25;
    sprite.x = Math.max(halfSize, Math.min(this.state.width - halfSize, sprite.x));
    sprite.y = Math.max(halfSize, Math.min(this.state.height - halfSize, sprite.y));
  }

  private evaluateCondition(condition: any): boolean {
    if (typeof condition === 'boolean') return condition;
    if (condition?.type === 'TOUCHING_EDGE') {
      const sprite = this.state.sprites.main;
      const halfSize = (sprite.size / 100) * 25;
      return (
        sprite.x <= halfSize ||
        sprite.x >= this.state.width - halfSize ||
        sprite.y <= halfSize ||
        sprite.y >= this.state.height - halfSize
      );
    }
    return false;
  }

  getState(): StageState {
    return this.state;
  }
}
