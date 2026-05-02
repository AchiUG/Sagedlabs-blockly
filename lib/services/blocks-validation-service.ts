
export interface ValidationResult {
  isValid: boolean;
  message: string;
  feedback?: string;
}

export class BlocksValidationService {
  /**
   * Validates a student's Blockly solution based on the lesson slug
   * @param lessonSlug The lesson being validated
   * @param generatedCode JSON string of the commands generated from Blockly
   */
  static validate(lessonSlug: string, generatedCode: string | null): ValidationResult {
    if (!generatedCode) {
      return { isValid: false, message: 'No code submitted' };
    }

    try {
      const commands = JSON.parse(generatedCode);
      
      switch (lessonSlug) {
        case 'hello-world':
          return this.validateHelloWorld(commands);
        case 'move-around':
          return this.validateMoveAround(commands);
        case 'simple-animation':
          return this.validateSimpleAnimation(commands);
        case 'interactive-story':
          return this.validateInteractiveStory(commands);
        case 'leuk-says-hello':
          return this.validateLeukSaysHello(commands);
        case 'leuk-explores':
          return this.validateLeukExplores(commands);
        case 'leuk-bounces':
          return this.validateLeukBounces(commands);
        case 'leuk-litter-detector':
          return this.validateLitterDetector(commands);
        case 'capstone-project':
          return this.validateCapstone(commands);
        default:
          return { isValid: true, message: 'Lesson completed' };
      }
    } catch (error) {
      console.error('Validation error:', error);
      return { isValid: false, message: 'Could not parse project code' };
    }
  }

  private static validateHelloWorld(commands: any[]): ValidationResult {
    const onStart = commands.find(c => c.type === 'ON_START');
    const hasSay = onStart?.actions?.some((a: any) => a.type === 'SAY');
    
    if (hasSay) {
      return { isValid: true, message: 'Great job! You made the sprite talk.' };
    }
    return { isValid: false, message: 'Try adding a "Say" block inside the "When program starts" block.' };
  }

  private static validateMoveAround(commands: any[]): ValidationResult {
    const keyEvents = commands.filter(c => c.type === 'ON_KEY');
    const keys = new Set(keyEvents.map(c => c.key));
    
    if (keys.size >= 4) {
      return { isValid: true, message: 'Awesome! You created a full control system.' };
    }
    return { isValid: false, message: `You've used ${keys.size} keys. Try adding blocks for all 4 arrow keys.` };
  }

  private static validateSimpleAnimation(commands: any[]): ValidationResult {
    const forever = commands.find(c => c.type === 'FOREVER');
    const hasMove = forever?.actions?.some((a: any) => a.type === 'MOVE_X' || a.type === 'MOVE_Y');
    const hasBounce = forever?.actions?.some((a: any) => a.type === 'BOUNCE');
    
    if (hasMove && hasBounce) {
      return { isValid: true, message: 'Perfect! Your character will now move forever.' };
    }
    return { isValid: false, message: 'Make sure you have both a movement block and a "bounce" block inside the "Forever" loop.' };
  }

  private static validateInteractiveStory(commands: any[]): ValidationResult {
    const keyEvents = commands.filter(c => c.type === 'ON_KEY');
    
    // Flatten all actions to find SAY blocks
    const allActions = commands.reduce((acc, cmd) => [...acc, ...(cmd.actions || [])], []);
    const sayBlocks = allActions.filter((a: any) => a.type === 'SAY');
    
    if (keyEvents.length >= 3 && sayBlocks.length >= 5) {
      return { isValid: true, message: 'What a great story! You used multiple interactions.' };
    }
    return { 
      isValid: false, 
      message: `Keep going! Your story needs at least 3 key events and 5 different messages. (Current: ${keyEvents.length} keys, ${sayBlocks.length} messages)` 
    };
  }

  private static validateLeukSaysHello(commands: any[]): ValidationResult {
    const onStart = commands.find(c => c.type === 'ON_START');
    const sayBlock = onStart?.actions?.find((a: any) => a.type === 'SAY');
    const text = sayBlock?.text?.toLowerCase() || '';
    
    if (sayBlock && text.includes('leuk')) {
      return { isValid: true, message: 'Welcome Leuk! You successfully introduced our clever hare.' };
    }
    return { isValid: false, message: 'Make Leuk say hello! Ensure your text includes the name "Leuk".' };
  }

  private static validateLeukExplores(commands: any[]): ValidationResult {
    const onStart = commands.find(c => c.type === 'ON_START');
    const moves = onStart?.actions?.filter((a: any) => a.type.startsWith('MOVE')) || [];
    
    if (moves.length >= 4) {
      return { isValid: true, message: 'Exploration complete! You helped Leuk navigate the Savanna.' };
    }
    return { isValid: false, message: 'Leuk needs to explore more! Try adding at least 4 movement steps.' };
  }

  private static validateLeukBounces(commands: any[]): ValidationResult {
    const forever = commands.find(c => c.type === 'FOREVER');
    const hasBounce = forever?.actions?.some((a: any) => a.type === 'BOUNCE');
    
    if (hasBounce) {
      return { isValid: true, message: 'Great! Leuk is now safely bouncing within his limits.' };
    }
    return { isValid: false, message: 'Don\'t let Leuk run away! Add a "bounce if on edge" block inside the loop.' };
  }

  private static validateLitterDetector(commands: any[]): ValidationResult {
    const allActions = commands.reduce((acc, cmd) => [...acc, ...(cmd.actions || [])], []);
    const hasIf = allActions.some((a: any) => a.type === 'IF');
    
    if (hasIf) {
      return { isValid: true, message: 'Excellent! Leuk is now detecting litter using logic.' };
    }
    return { isValid: false, message: 'Your detector needs logic. Try using an "If" block to check Leuk\'s position.' };
  }

  private static validateCapstone(commands: any[]): ValidationResult {
    if (commands.length === 0) {
      return { isValid: false, message: 'Your capstone project is empty. Build something amazing!' };
    }

    const hasEvent = commands.some(c => ['ON_START', 'ON_KEY', 'FOREVER'].includes(c.type));
    
    // Check all nested actions for IF and Motion/Looks
    const allActions: any[] = [];
    const collectActions = (cmds: any[]) => {
      cmds.forEach(cmd => {
        if (cmd.actions) collectActions(cmd.actions);
        if (cmd.then) collectActions(cmd.then);
        if (cmd.else) collectActions(cmd.else);
        allActions.push(cmd);
      });
    };
    collectActions(commands);

    const hasIf = allActions.some(a => a.type === 'IF');
    const hasMotion = allActions.some(a => ['MOVE_X', 'MOVE_Y', 'SET_X', 'SET_Y', 'GO_TO', 'BOUNCE'].includes(a.type));
    const hasLooks = allActions.some(a => ['SAY', 'ASK', 'SET_COLOR', 'SET_SIZE', 'SHOW', 'HIDE'].includes(a.type));

    if (!hasEvent) {
      return { isValid: false, message: 'Your project needs at least one Event block (like "When program starts" or "Forever").' };
    }
    if (!hasIf) {
      return { isValid: false, message: 'Your project needs an interaction using "If" logic!' };
    }
    if (!hasMotion && !hasLooks) {
      return { isValid: false, message: 'Add some feedback using Motion or Looks blocks so we can see what happens!' };
    }

    return { isValid: true, message: 'Congratulations on completing your Capstone project! Your solution is well-designed.' };
  }
}
