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
  private onUpdate: ((state: StageState) => void) | null = null;

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
      if (!cmd) continue;
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

  async start(onUpdate: (state: StageState) => void) {
    this.state.running = true;
    this.onUpdate = onUpdate;
    
    // Run all START scripts in parallel
    this.startActions.forEach(actions => this.executeActions(actions));

    // Start the game loop for FOREVER scripts and updates
    const loop = async () => {
      if (!this.state.running) return;

      // Handle forever loops (these run continuously in the background)
      // Note: In a real engine, we'd throttle these or make them async too
      for (const actions of this.foreverLoops) {
        // Run forever loops without awaiting to not block the main frame
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

      this.onUpdate?.(this.state);
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
      handlers.forEach(actions => this.executeActions(actions));
    }
  }

  handleKeyUp(code: string) {
    this.state.pressedKeys.delete(code);
  }

  private async executeActions(actions: any[]) {
    if (!this.state.running) return;
    
    const sprite = this.state.sprites.main;

    for (const action of actions) {
      if (!this.state.running) break;
      if (!action || typeof action !== 'object') continue;

      switch (action.type) {
        case 'MOVE_X':
          sprite.x += Number(this.evaluateCondition(action.value)) || 0;
          break;
        case 'MOVE_Y':
          sprite.y -= Number(this.evaluateCondition(action.value)) || 0;
          break;
        case 'SET_X':
          sprite.x = (this.state.width / 2) + (Number(this.evaluateCondition(action.value)) || 0);
          break;
        case 'SET_Y':
          sprite.y = (this.state.height / 2) - (Number(this.evaluateCondition(action.value)) || 0);
          break;
        case 'GO_TO':
          sprite.x = (this.state.width / 2) + (Number(this.evaluateCondition(action.x)) || 0);
          sprite.y = (this.state.height / 2) - (Number(this.evaluateCondition(action.y)) || 0);
          break;
        case 'BOUNCE':
          this.bounceOnEdge(sprite);
          break;
        case 'SAY':
          sprite.message = String(this.evaluateCondition(action.text) ?? '');
          sprite.messageTimer = 180;
          break;
        case 'SET_COLOR':
          sprite.color = action.color || '#124734';
          break;
        case 'SET_SIZE':
          sprite.size = Math.max(10, Math.min(500, Number(this.evaluateCondition(action.size)) || 100));
          break;
        case 'SHOW':
          sprite.visible = true;
          break;
        case 'HIDE':
          sprite.visible = false;
          break;
        case 'WAIT':
          const seconds = Number(this.evaluateCondition(action.seconds)) || 0;
          await new Promise(resolve => setTimeout(resolve, seconds * 1000));
          break;
        case 'REPEAT':
          const times = Number(this.evaluateCondition(action.times)) || 1;
          for (let i = 0; i < times; i++) {
            if (!this.state.running) break;
            await this.executeActions(action.actions || []);
          }
          break;
        case 'IF':
          if (this.evaluateCondition(action.condition)) {
            await this.executeActions(action.then || []);
          } else if (action.else) {
            await this.executeActions(action.else || []);
          }
          break;
      }
      
      // Update UI after each step in a sequence
      this.onUpdate?.(this.state);
    }

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

  private evaluateCondition(condition: any): any {
    if (typeof condition === 'boolean') return condition;
    if (typeof condition === 'number') return condition;
    if (typeof condition === 'string') return condition;
    
    if (!condition || typeof condition !== 'object') return false;

    const sprite = this.state.sprites.main;
    const halfSize = (sprite.size / 100) * 25;

    switch (condition.type) {
      case 'TOUCHING_EDGE':
        return (
          sprite.x <= halfSize ||
          sprite.x >= this.state.width - halfSize ||
          sprite.y <= halfSize ||
          sprite.y >= this.state.height - halfSize
        );
      case 'ARITHMETIC':
        const a = Number(this.evaluateCondition(condition.a));
        const b = Number(this.evaluateCondition(condition.b));
        switch (condition.op) {
          case 'ADD': return a + b;
          case 'MINUS': return a - b;
          case 'MULTIPLY': return a * b;
          case 'DIVIDE': return b === 0 ? 0 : a / b;
          case 'POWER': return Math.pow(a, b);
          default: return 0;
        }
      case 'RANDOM_INT':
        const min = Math.min(Number(this.evaluateCondition(condition.from)), Number(this.evaluateCondition(condition.to)));
        const max = Math.max(Number(this.evaluateCondition(condition.from)), Number(this.evaluateCondition(condition.to)));
        return Math.floor(Math.random() * (max - min + 1)) + min;
      case 'X_POSITION':
        return sprite.x - (this.state.width / 2);
      case 'Y_POSITION':
        return (this.state.height / 2) - sprite.y;
      case 'TEXT_JOIN':
        return condition.parts.map((p: any) => this.evaluateCondition(p)).join('');
      default:
        return false;
    }
  }

  getState(): StageState {
    return this.state;
  }
}
