'use client';

import { useEffect, useRef, useCallback, useState, useImperativeHandle, forwardRef } from 'react';
import { defineCustomBlocks, workspaceToCommands } from './custom-blocks';
import { defaultToolbox } from './toolbox-config';

interface BlocklyWorkspaceProps {
  initialWorkspace?: any;
  starterWorkspace?: any;
  toolboxConfig?: any;
  onWorkspaceChange?: (workspace: any, commands: any[]) => void;
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
  readOnly = false,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const selectedCatRef = useRef<string | null>(null);
  const colorMapRef = useRef<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [Blockly, setBlockly] = useState<any>(null);

  const actualToolbox = toolboxConfig || defaultToolbox;

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    resetWorkspace: () => {
      if (workspaceRef.current && Blockly) {
        // Clear and reload starter workspace
        workspaceRef.current.clear();
        if (starterWorkspace) {
          try {
            // Ensure we are in a state that allows loading
            const wasReadOnly = workspaceRef.current.readOnly;
            if (wasReadOnly) workspaceRef.current.options.readOnly = false;
            
            Blockly.serialization.workspaces.load(starterWorkspace, workspaceRef.current);
            
            if (wasReadOnly) workspaceRef.current.options.readOnly = true;
          } catch (error) {
            console.error('Failed to reload starter workspace:', error);
          }
        }
        // Force update parent immediately after reset
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

  // Load Blockly dynamically (client-side only)
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

  // Restyle native Blockly toolbox categories so they fully highlight on click
  // (same proven pattern used by story-builder)
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

    // Style the toolbox container
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

    // Capture each category's border-left colour (set by Blockly from toolbox config)
    const colorMap: Record<string, string> = {};
    cats.forEach((cat: Element) => {
      const el = cat as HTMLElement;
      const id = el.id;
      const color = el.style.borderLeftColor;
      if (color && id) colorMap[id] = color;
    });
    colorMapRef.current = colorMap;

    // Helper to set !important inline styles
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

    // Apply default unselected style
    cats.forEach((cat: Element) => styleTab(cat as HTMLElement, false));

    const applySelection = (selectedId: string | null) => {
      cats.forEach((cat: Element) => {
        const el = cat as HTMLElement;
        styleTab(el, el.id === selectedId);
      });
    };

    // 1. Add click listeners for immediate visual feedback
    cats.forEach((cat: Element) => {
      const el = cat as HTMLElement;
      el.addEventListener('click', () => {
        // If we click an already selected category, Blockly might close it
        // but we'll let the event listener handle the final state sync.
        applySelection(el.id);
      });
    });

    // 2. Use Blockly's event system to track deselection (e.g. clicking workspace)
    if (workspaceRef.current) {
      const workspace = workspaceRef.current;
      
      const onToolboxSelect = (event: any) => {
        if (event.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
          // Sync our UI with Blockly's internal selection
          // newItem will be null if the flyout is closed
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

    // If workspace already exists, dispose it before re-injecting (handles prop changes)
    if (workspaceRef.current) {
      if ((workspaceRef.current as any)._toolboxListener) {
        workspaceRef.current.removeChangeListener((workspaceRef.current as any)._toolboxListener);
      }
      workspaceRef.current.dispose();
      workspaceRef.current = null;
    }

    defineCustomBlocks(Blockly);

    // Register a custom flyout callback for variables to add shadow blocks
    workspaceRef.current = new (Blockly as any).Workspace(); // Temporary to get access to registry if needed, or just use Blockly
    
    const variableCategoryCallback = (workspace: any) => {
      const xmlList = [];
      const button = document.createElement('button');
      button.setAttribute('text', 'Create Variable...');
      button.setAttribute('callbackKey', 'CREATE_VARIABLE');
      xmlList.push(button);

      const blockList = Blockly.Variables.allUsedDeveloperVariables(workspace);
      const variableList = workspace.getVariablesOfType('');

      if (variableList.length > 0) {
        // variables_set block with math_number shadow
        if (Blockly.Blocks['variables_set']) {
          const block = document.createElement('block');
          block.setAttribute('type', 'variables_set');
          block.setAttribute('gap', '8');
          const value = document.createElement('value');
          value.setAttribute('name', 'VALUE');
          const shadow = document.createElement('shadow');
          shadow.setAttribute('type', 'math_number');
          const field = document.createElement('field');
          field.setAttribute('name', 'NUM');
          field.innerText = '0';
          shadow.appendChild(field);
          value.appendChild(shadow);
          block.appendChild(value);
          xmlList.push(block);
        }

        // math_change block with math_number shadow
        if (Blockly.Blocks['math_change']) {
          const block = document.createElement('block');
          block.setAttribute('type', 'math_change');
          block.setAttribute('gap', '8');
          const value = document.createElement('value');
          value.setAttribute('name', 'DELTA');
          const shadow = document.createElement('shadow');
          shadow.setAttribute('type', 'math_number');
          const field = document.createElement('field');
          field.setAttribute('name', 'NUM');
          field.innerText = '1';
          shadow.appendChild(field);
          value.appendChild(shadow);
          block.appendChild(value);
          xmlList.push(block);
        }

        // variables_get block
        if (Blockly.Blocks['variables_get']) {
          variableList.sort(Blockly.VariableModel.compareByName);
          for (let i = 0; i < variableList.length; i++) {
            const block = document.createElement('block');
            block.setAttribute('type', 'variables_get');
            block.setAttribute('gap', '8');
            const field = document.createElement('field');
            field.setAttribute('name', 'VAR');
            field.innerText = variableList[i].name;
            block.appendChild(field);
            xmlList.push(block);
          }
        }
      }
      return xmlList;
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

    // Register variable callback
    workspace.registerToolboxCategoryCallback('VARIABLE', variableCategoryCallback);

    workspaceRef.current = workspace;

    // Disable auto-close on flyout so blocks persist while dragging (Scratch-like behavior)
    const flyout = workspace.getFlyout();
    if (flyout) {
      (flyout as any).autoClose = false;
    }

    // Load initial workspace state
    const workspaceToLoad = initialWorkspace || starterWorkspace;
    if (workspaceToLoad) {
      try {
        Blockly.serialization.workspaces.load(workspaceToLoad, workspace);
      } catch (error) {
        console.error('Failed to load workspace state:', error);
      }
    }

    // Force an update to parent to sync the loaded state (especially if it came from starter)
    // We use a small timeout to ensure the workspace is fully settled and rendered
    setTimeout(() => {
      if (onWorkspaceChange && workspaceRef.current) {
        const state = Blockly.serialization.workspaces.save(workspaceRef.current);
        const commands = workspaceToCommands(workspaceRef.current);
        onWorkspaceChange(state, commands);
      }
    }, 100);

    // Style the native toolbox categories after DOM is ready
    setTimeout(() => setupCategoryTabs(), 150);

    // Ensure initial sizing is correct
    const doResize = () => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    };
    requestAnimationFrame(() => {
      doResize();
      requestAnimationFrame(doResize);
    });

    // React to container size changes
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = new ResizeObserver(() => doResize());
      resizeObserverRef.current.observe(containerRef.current);
    }

    // Change listener with debounce
    let debounceTimer: NodeJS.Timeout;
    const handleChange = (event: any) => {
      if (event.isUiEvent) return;
      
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
  }, [Blockly, readOnly, actualToolbox]); // Back to stable dependencies

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (workspaceRef.current && Blockly) {
        Blockly.svgResize(workspaceRef.current);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [Blockly]);

  // Public helpers
  const getWorkspace = useCallback(() => {
    if (!workspaceRef.current || !Blockly) return null;
    return Blockly.serialization.workspaces.save(workspaceRef.current);
  }, [Blockly]);

  const getCommands = useCallback(() => {
    if (!workspaceRef.current) return [];
    return workspaceToCommands(workspaceRef.current);
  }, []);

  return (
    <div 
      className="blockly-wrapper"
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        minHeight: 600,
        overflow: 'hidden'
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
      
      {/* 
        The 'all: initial' wrapper is CRITICAL. 
        It prevents Tailwind's base styles (like box-sizing: border-box on everything) 
        from breaking Blockly's internal SVG calculations.
      */}
      <div 
        style={{ all: 'initial', display: 'block', width: '100%', height: '100%' }}
      >
        <div 
          ref={containerRef} 
          style={{ width: '100%', height: '100%', display: 'block' }} 
        />
      </div>

      <style jsx global>{`
        /* 
           Style Blockly's internal widget containers (inputs, dropdowns).
           We use a z-index lower than the Shadcn/Radix Dialog (usually 50)
           to prevent input fields from overlapping the submit popup.
        */
        .blocklyWidgetDiv, .blocklyDropDownDiv {
          z-index: 45 !important;
        }
        
        .blocklyTooltipDiv {
          z-index: 46 !important;
        }
        
        /* Fix toolbox box-sizing which Tailwind breaks */
        .blocklyToolboxDiv {
          box-sizing: content-box !important;
        }

        /* Ensure the flyout stays visible and interactive */
        .blocklyFlyout {
          pointer-events: auto !important;
        }

        /* Prevent text color flickering in flyout */
        .blocklyFlyoutLabelText {
          fill: #44403c !important;
        }
      `}</style>
    </div>
  );
});

BlocklyWorkspace.displayName = 'BlocklyWorkspace';
export default BlocklyWorkspace;
