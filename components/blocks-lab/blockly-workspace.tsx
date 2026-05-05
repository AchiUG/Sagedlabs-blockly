'use client';

import { useEffect, useRef, useCallback, useState, useImperativeHandle, forwardRef } from 'react';
import { defineCustomBlocks, workspaceToCommands } from './custom-blocks';
import { defaultToolbox } from './toolbox-config';

interface BlocklyWorkspaceProps {
  initialWorkspace?: any;
  starterWorkspace?: any;
  toolboxConfig?: any;
  onWorkspaceChange?: (workspace: any, commands: any[]) => void;
  onPrompt?: (message: string, defaultValue: string, callback: (val: string | null) => void) => void;
  readOnly?: boolean;
}

export interface BlocklyWorkspaceHandle {
  resetWorkspace: () => void;
  getCommands: () => any[];
}

const BlocklyWorkspace = forwardRef<BlocklyWorkspaceHandle, BlocklyWorkspaceProps>(({
  initialWorkspace,
  starterWorkspace,
  toolboxConfig,
  onWorkspaceChange,
  onPrompt,
  readOnly = false,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const colorMapRef = useRef<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [Blockly, setBlockly] = useState<any>(null);
  const lastVarIdRef = useRef<string | null>(null);

  const actualToolbox = toolboxConfig || defaultToolbox;

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    resetWorkspace: () => {
      if (workspaceRef.current && Blockly) {
        workspaceRef.current.clear();
        if (starterWorkspace) {
          try {
            const wasReadOnly = workspaceRef.current.readOnly;
            if (wasReadOnly) workspaceRef.current.options.readOnly = false;
            Blockly.serialization.workspaces.load(starterWorkspace, workspaceRef.current);
            if (wasReadOnly) workspaceRef.current.options.readOnly = true;
          } catch (error) {
            console.error('Failed to reload starter workspace:', error);
          }
        }
        const state = Blockly.serialization.workspaces.save(workspaceRef.current);
        const commands = workspaceToCommands(workspaceRef.current);
        if (onWorkspaceChange) {
          onWorkspaceChange(state, commands);
        }
      }
    },
    getCommands: () => {
      if (!workspaceRef.current) return [];
      return workspaceToCommands(workspaceRef.current);
    }
  }), [Blockly, starterWorkspace, onWorkspaceChange]);

  // Load Blockly dynamically
  useEffect(() => {
    let mounted = true;
    const loadBlockly = async () => {
      try {
        const Blockly = await import('blockly');
        await import('blockly/blocks');
        if (mounted) {
          if (!Blockly.Blocks) (Blockly as any).Blocks = {};
          if (typeof window !== 'undefined') (window as any).Blockly = Blockly;
          setBlockly(Blockly);
        }
      } catch (error) {
        console.error('Failed to load Blockly:', error);
      }
    };
    loadBlockly();
    return () => { mounted = false; };
  }, []);

  // Restyle native Blockly toolbox categories
  const setupCategoryTabs = useCallback(() => {
    if (!containerRef.current) return;
    const cats = containerRef.current.querySelectorAll('.blocklyToolboxCategory');
    if (!cats.length) return;

    const toolbox = containerRef.current.querySelector('.blocklyToolbox') as HTMLElement;
    const group = containerRef.current.querySelector('.blocklyToolboxCategoryGroup') as HTMLElement;
    const catContainer = containerRef.current.querySelector('.blocklyToolboxCategoryContainer') as HTMLElement;

    const forceStyle = (el: HTMLElement, prop: string, val: string) => {
      el.style.setProperty(prop, val, 'important');
    };

    if (toolbox) {
      forceStyle(toolbox, 'background', '#fafaf9');
      forceStyle(toolbox, 'border-right', '2px solid #e7e5e4');
      forceStyle(toolbox, 'padding', '16px 6px 8px 6px');
      forceStyle(toolbox, 'min-width', '130px');
      forceStyle(toolbox, 'overflow', 'auto');
      forceStyle(toolbox, 'pointer-events', 'auto');
    }
    if (group) {
      forceStyle(group, 'display', 'flex');
      forceStyle(group, 'flex-direction', 'column');
      forceStyle(group, 'gap', '6px');
      forceStyle(group, 'width', '100%');
    }
    if (catContainer) {
      forceStyle(catContainer, 'width', '100%');
    }

    const colorMap: Record<string, string> = {};
    cats.forEach((cat: Element) => {
      const el = cat as HTMLElement;
      const id = el.id;
      const color = el.style.borderLeftColor;
      if (color && id) colorMap[id] = color;
    });
    colorMapRef.current = colorMap;

    const setI = (el: HTMLElement, prop: string, val: string) => {
      el.style.setProperty(prop, val, 'important');
    };

    const styleTab = (el: HTMLElement, isSelected: boolean) => {
      const id = el.id;
      const color = colorMap[id] || '';
      const bg = isSelected && color ? color : 'transparent';
      const textColor = isSelected && color ? '#fff' : '#44403c';

      setI(el, 'padding', '10px 12px');
      setI(el, 'margin', '4px 0');
      setI(el, 'border', 'none');
      setI(el, 'border-left', 'none');
      setI(el, 'border-radius', '8px');
      setI(el, 'cursor', 'pointer');
      setI(el, 'display', 'flex');
      setI(el, 'align-items', 'center');
      setI(el, 'width', '100%');
      setI(el, 'box-sizing', 'border-box');
      setI(el, 'white-space', 'nowrap');
      setI(el, 'background-color', bg);
      setI(el, 'box-shadow', isSelected ? '0 2px 4px rgba(0,0,0,0.1)' : 'none');
      setI(el, 'pointer-events', 'auto');
      el.setAttribute('data-selected', String(isSelected));

      const label = el.querySelector('.blocklyToolboxCategoryLabel') as HTMLElement;
      if (label) {
        setI(label, 'font-size', '13px');
        setI(label, 'font-weight', '600');
        setI(label, 'color', textColor);
        setI(label, 'white-space', 'nowrap');
        setI(label, 'line-height', '1');
        setI(label, 'display', 'block');
        if (isSelected) {
          setI(label, 'text-shadow', '0 1px 2px rgba(0,0,0,0.1)');
        } else {
          label.style.removeProperty('text-shadow');
        }
      }

      const icon = el.querySelector('.blocklyToolboxCategoryIcon') as HTMLElement;
      if (icon) setI(icon, 'display', 'none');
    };

    cats.forEach((cat: Element) => styleTab(cat as HTMLElement, false));

    const applySelection = (selectedId: string | null) => {
      cats.forEach((cat: Element) => {
        const el = cat as HTMLElement;
        styleTab(el, el.id === selectedId);
      });
    };

    cats.forEach((cat: Element) => {
      const el = cat as HTMLElement;
      el.addEventListener('click', () => applySelection(el.id));
    });

    if (workspaceRef.current) {
      const workspace = workspaceRef.current;
      const onToolboxSelect = (event: any) => {
        if (event.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
          applySelection(event.newItem || null);
        }
      };
      workspace.addChangeListener(onToolboxSelect);
      (workspace as any)._toolboxListener = onToolboxSelect;
    }

    applySelection(null);
  }, [Blockly]);

  // Initialize workspace
  useEffect(() => {
    if (!Blockly || !containerRef.current) return;

    if (workspaceRef.current) {
      if ((workspaceRef.current as any)._toolboxListener) {
        workspaceRef.current.removeChangeListener((workspaceRef.current as any)._toolboxListener);
      }
      workspaceRef.current.dispose();
      workspaceRef.current = null;
    }

    defineCustomBlocks(Blockly);

    /**
     * Modern Variable Category Callback
     * Uses XML elements for blocks to ensure variable name inheritance is 100% reliable.
     */
    const variableCategoryCallback = (workspace: any) => {
      const content: any[] = [];
      
      content.push({
        kind: 'button',
        text: 'Create Variable...',
        callbackKey: 'CREATE_VARIABLE',
      });

      const variableList = workspace.getVariableMap().getVariablesOfType('');
      
      if (variableList.length > 0) {
        // Determine the "newest" variable for Set/Change blocks
        let newestVar = variableList[variableList.length - 1];
        if (lastVarIdRef.current) {
          const found = variableList.find((v: any) => v.getId() === lastVarIdRef.current);
          if (found) newestVar = found;
        }

        /**
         * Helper to create a variable block using XML (guarantees name inheritance)
         */
        const createVarBlockXml = (type: string, variable: any, gap: number = 8) => {
          const block = Blockly.utils.xml.createElement('block');
          block.setAttribute('type', type);
          block.setAttribute('gap', gap.toString());
          const field = Blockly.utils.xml.createElement('field');
          field.setAttribute('name', 'VAR');
          field.setAttribute('id', variable.getId());
          field.appendChild(Blockly.utils.xml.createTextNode(variable.name));
          block.appendChild(field);
          return block;
        };

        // 1. Create Set block with shadow input
        const setBlock = createVarBlockXml('variables_set', newestVar, 8);
        const setValue = Blockly.utils.xml.createElement('value');
        setValue.setAttribute('name', 'VALUE');
        const setShadow = Blockly.utils.xml.createElement('shadow');
        setShadow.setAttribute('type', 'math_number');
        const setNumField = Blockly.utils.xml.createElement('field');
        setNumField.setAttribute('name', 'NUM');
        setNumField.appendChild(Blockly.utils.xml.createTextNode('0'));
        setShadow.appendChild(setNumField);
        setValue.appendChild(setShadow);
        setBlock.appendChild(setValue);
        content.push(setBlock);

        // 2. Create Change block with shadow input
        const changeBlock = createVarBlockXml('math_change', newestVar, 24);
        const changeValue = Blockly.utils.xml.createElement('value');
        changeValue.setAttribute('name', 'DELTA');
        const changeShadow = Blockly.utils.xml.createElement('shadow');
        changeShadow.setAttribute('type', 'math_number');
        const changeNumField = Blockly.utils.xml.createElement('field');
        changeNumField.setAttribute('name', 'NUM');
        changeNumField.appendChild(Blockly.utils.xml.createTextNode('1'));
        changeShadow.appendChild(changeNumField);
        changeValue.appendChild(changeShadow);
        changeBlock.appendChild(changeValue);
        content.push(changeBlock);

        // 3. Variable Inheritance List: One getter block for every unique variable
        const sortedVariables = [...variableList].sort((a, b) => 
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );

        const seenNames = new Set<string>();
        for (const variable of sortedVariables) {
          const nameLower = variable.name.toLowerCase().trim();
          if (nameLower && !seenNames.has(nameLower)) {
            content.push(createVarBlockXml('variables_get', variable, 8));
            seenNames.add(nameLower);
          }
        }
      }
      return content;
    };

    const workspace = Blockly.inject(containerRef.current, {
      toolbox: actualToolbox,
      grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.9,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      trashcan: true,
      move: { scrollbars: true, drag: true, wheel: true },
      readOnly,
    });

    workspace.registerToolboxCategoryCallback('VARIABLE', variableCategoryCallback);
    
    workspace.registerButtonCallback('CREATE_VARIABLE', (button: any) => {
      Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace());
    });

    // Handle custom prompt override
    if (onPrompt) {
      Blockly.dialog.setPrompt((message: string, defaultValue: string, callback: (val: string | null) => void) => {
        onPrompt(message, defaultValue, callback);
      });
    }

    workspaceRef.current = workspace;

    const flyout = workspace.getFlyout();
    if (flyout) (flyout as any).autoClose = false;

    const workspaceToLoad = initialWorkspace || starterWorkspace;
    if (workspaceToLoad) {
      try {
        Blockly.serialization.workspaces.load(workspaceToLoad, workspace);
      } catch (error) {
        console.error('Failed to load workspace state:', error);
      }
    }

    setTimeout(() => {
      if (onWorkspaceChange && workspaceRef.current) {
        const state = Blockly.serialization.workspaces.save(workspaceRef.current);
        const commands = workspaceToCommands(workspaceRef.current);
        onWorkspaceChange(state, commands);
      }
    }, 100);

    setTimeout(() => setupCategoryTabs(), 150);

    const doResize = () => {
      if (workspaceRef.current) Blockly.svgResize(workspaceRef.current);
    };
    requestAnimationFrame(() => {
      doResize();
      requestAnimationFrame(doResize);
    });

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = new ResizeObserver(() => doResize());
      resizeObserverRef.current.observe(containerRef.current);
    }

    let debounceTimer: NodeJS.Timeout;
    const handleChange = (event: any) => {
      if (event.isUiEvent) return;

      // Handle variable creation/renaming to update the "Intelligent" toolbox blocks
      if (event.type === Blockly.Events.VAR_CREATE || event.type === Blockly.Events.VAR_RENAME) {
        console.log(`[Blockly] Variable event: ${event.type}, varId: ${event.varId}`);
        lastVarIdRef.current = event.varId;
        const ws = workspaceRef.current;
        if (ws && ws.getToolbox()) {
          const toolbox = ws.getToolbox();
          const category = toolbox.getToolboxItems().find((item: any) => 
            item.name_ === '🔢 Variables' || item.id_ === 'VARIABLE'
          );
          const selectedItem = toolbox.getSelectedItem();
          if (category && selectedItem === category) {
            const flyout = ws.getFlyout();
            if (flyout) {
              const contents = variableCategoryCallback(ws);
              console.log(`[Blockly] Refreshing variable flyout with ${contents.length} items`);
              flyout.show(contents);
            }
          }
        }
      }

      // Sync object names to variables
      if (!readOnly && workspaceRef.current && (
        event.type === Blockly.Events.BLOCK_CREATE || 
        event.type === Blockly.Events.BLOCK_CHANGE ||
        event.type === Blockly.Events.BLOCK_MOVE
      )) {
        const ws = workspaceRef.current;
        const allBlocks = ws.getAllBlocks(false);
        const objectNames = new Set<string>();
        
        for (const block of allBlocks) {
          if (block.type === 'saged_create_object') {
            const idInput = block.getInput('ID');
            if (idInput && idInput.connection && idInput.connection.targetBlock()) {
              const target = idInput.connection.targetBlock();
              if (target.type === 'text') {
                const name = target.getFieldValue('TEXT');
                if (name && name.trim()) {
                  objectNames.add(name.trim());
                }
              }
            }
          }
        }

        const variableMap = ws.getVariableMap();
        const existingVariables = variableMap.getVariablesOfType('');
        const existingNames = new Set(existingVariables.map((v: any) => v.name.toLowerCase()));
        
        let changed = false;
        for (const name of objectNames) {
          if (!existingNames.has(name.toLowerCase())) {
            const newVar = ws.createVariable(name);
            lastVarIdRef.current = newVar.getId();
            changed = true;
          }
        }
        
        // If we added variables, refresh the toolbox if it's open
        if (changed && ws.getToolbox()) {
          const toolbox = ws.getToolbox();
          const category = toolbox.getToolboxItems().find((item: any) => 
            item.name_ === '🔢 Variables' || item.id_ === 'VARIABLE'
          );
          const selectedItem = toolbox.getSelectedItem();
          if (category && selectedItem === category) {
            // Force the flyout to re-render its contents immediately
            const flyout = ws.getFlyout();
            if (flyout) {
              const contents = variableCategoryCallback(ws);
              console.log(`[Blockly] Auto-sync: Refreshing variable flyout`);
              flyout.show(contents);
            }
          }
        }
      }

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (onWorkspaceChange && workspaceRef.current) {
          const state = Blockly.serialization.workspaces.save(workspaceRef.current);
          const commands = workspaceToCommands(workspaceRef.current);
          onWorkspaceChange(state, commands);
        }
      }, 300);
    };

    workspace.addChangeListener(handleChange);
    setIsLoaded(true);

    return () => {
      clearTimeout(debounceTimer);
      resizeObserverRef.current?.disconnect(); 
      if (workspaceRef.current) {
        if ((workspaceRef.current as any)._toolboxListener) {
          workspaceRef.current.removeChangeListener((workspaceRef.current as any)._toolboxListener);
        }
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [Blockly, readOnly, actualToolbox]);

  useEffect(() => {
    const handleResize = () => {
      if (workspaceRef.current && Blockly) Blockly.svgResize(workspaceRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [Blockly]);

  return (
    <div 
      className="blockly-wrapper"
      style={{ 
        position: 'relative', width: '100%', height: '100%',
        minHeight: 600, overflow: 'hidden'
      }}
    >
      {!isLoaded && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: '#f3f4f6', zIndex: 30,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 32, height: 32, border: '3px solid #124734',
              borderTopColor: 'transparent', borderRadius: '50%',
              margin: '0 auto 8px',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{ color: '#6b7280' }}>Loading Blocks Editor...</p>
          </div>
        </div>
      )}
      
      <div 
        style={{ all: 'initial', display: 'block', width: '100%', height: '100%' }}
      >
        <div 
          ref={containerRef} 
          style={{ 
            width: '100%', height: '100%', display: 'block',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }} 
        />
      </div>

      <style jsx global>{`
        .blocklyWidgetDiv, .blocklyDropDownDiv { z-index: 200 !important; }
        .blocklyTooltipDiv { z-index: 201 !important; }
        .blocklyToolboxDiv { box-sizing: content-box !important; }
        .blocklyFlyout { pointer-events: auto !important; }
        .blocklyFlyoutLabelText { fill: #44403c !important; }
        .blocklyMenuItem {
          padding: 8px 12px !important;
          font-family: system-ui, sans-serif !important;
        }
      `}</style>
    </div>
  );
});

BlocklyWorkspace.displayName = 'BlocklyWorkspace';
export default BlocklyWorkspace;
