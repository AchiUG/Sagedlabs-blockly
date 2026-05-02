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
  const colorMapRef = useRef<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [Blockly, setBlockly] = useState<any>(null);

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
     * Modern Variable Category Callback (JSON-based for stability)
     */
    const variableCategoryCallback = (workspace: any) => {
      const content = [];
      
      // Button to create variable
      content.push({
        kind: 'button',
        text: 'Create Variable...',
        callbackKey: 'CREATE_VARIABLE',
      });

      const variableList = workspace.getVariablesOfType('');
      if (variableList.length > 0) {
        // set variable block with math_number shadow
        content.push({
          kind: 'block',
          type: 'variables_set',
          gap: 8,
          inputs: {
            VALUE: {
              shadow: {
                type: 'math_number',
                fields: { NUM: 0 },
              },
            },
          },
        });

        // change variable block with math_number shadow
        content.push({
          kind: 'block',
          type: 'math_change',
          gap: 24,
          inputs: {
            DELTA: {
              shadow: {
                type: 'math_number',
                fields: { NUM: 1 },
              },
            },
          },
        });

        // Add all existing variables
        variableList.sort(Blockly.VariableModel.compareByName);
        for (const variable of variableList) {
          content.push({
            kind: 'block',
            type: 'variables_get',
            gap: 8,
            fields: {
              VAR: variable.name,
            },
          });
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

    // Register variable callback on the workspace instance
    workspace.registerToolboxCategoryCallback('VARIABLE', variableCategoryCallback);
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
      
      <div style={{ all: 'initial', display: 'block', width: '100%', height: '100%' }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>

      <style jsx global>{`
        .blocklyWidgetDiv, .blocklyDropDownDiv { z-index: 45 !important; }
        .blocklyTooltipDiv { z-index: 46 !important; }
        .blocklyToolboxDiv { box-sizing: content-box !important; }
        .blocklyFlyout { pointer-events: auto !important; }
        .blocklyFlyoutLabelText { fill: #44403c !important; }
      `}</style>
    </div>
  );
});

BlocklyWorkspace.displayName = 'BlocklyWorkspace';
export default BlocklyWorkspace;
