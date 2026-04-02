'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { defineCustomBlocks, workspaceToCommands } from './custom-blocks';
import { defaultToolbox } from './toolbox-config';

interface BlocklyWorkspaceProps {
  initialWorkspace?: any;
  toolboxConfig?: any;
  onWorkspaceChange?: (workspace: any, commands: any[]) => void;
  readOnly?: boolean;
}

export default function BlocklyWorkspace({
  initialWorkspace,
  toolboxConfig,
  onWorkspaceChange,
  readOnly = false,
}: BlocklyWorkspaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<any>(null);
  const selectedCatRef = useRef<string | null>(null);
  const colorMapRef = useRef<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [Blockly, setBlockly] = useState<any>(null);

  const actualToolbox = toolboxConfig || defaultToolbox;

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

      setI(el, 'padding', '8px 12px');
      setI(el, 'margin', '0');
      setI(el, 'border', 'none');
      setI(el, 'border-left', 'none');
      setI(el, 'border-radius', '6px');
      setI(el, 'cursor', 'pointer');
      setI(el, 'display', 'block');
      setI(el, 'width', '100%');
      setI(el, 'box-sizing', 'border-box');
      setI(el, 'white-space', 'nowrap');
      setI(el, 'background-color', bg);
      setI(el, 'box-shadow', isSelected ? '0 1px 4px rgba(0,0,0,0.15)' : 'none');
      setI(el, 'pointer-events', 'auto');
      el.setAttribute('data-selected', String(isSelected));

      const label = el.querySelector('.blocklyToolboxCategoryLabel') as HTMLElement;
      if (label) {
        setI(label, 'font-size', '13px');
        setI(label, 'font-weight', '600');
        setI(label, 'color', textColor);
        setI(label, 'white-space', 'nowrap');
        if (isSelected) {
          setI(label, 'text-shadow', '0 1px 2px rgba(0,0,0,0.2)');
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
        styleTab(cat as HTMLElement, (cat as HTMLElement).id === selectedId);
      });
    };

    // Add click listeners for visual highlight
    cats.forEach((cat: Element) => {
      const el = cat as HTMLElement;
      el.addEventListener('click', () => {
        const alreadySelected = selectedCatRef.current === el.id;
        selectedCatRef.current = alreadySelected ? null : el.id;
        applySelection(selectedCatRef.current);
      });
    });

    selectedCatRef.current = null;
    applySelection(null);
  }, []);

  // Initialize workspace
  useEffect(() => {
    if (!Blockly || !containerRef.current || workspaceRef.current) return;

    defineCustomBlocks(Blockly);

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

    workspaceRef.current = workspace;

    // Style the native toolbox categories after DOM is ready
    setTimeout(() => setupCategoryTabs(), 150);

    // Load initial workspace if provided
    if (initialWorkspace) {
      try {
        Blockly.serialization.workspaces.load(initialWorkspace, workspace);
      } catch (error) {
        console.error('Failed to load initial workspace:', error);
      }
    }

    // Change listener with debounce
    let debounceTimer: NodeJS.Timeout;
    const handleChange = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (onWorkspaceChange && workspaceRef.current) {
          const state = Blockly.serialization.workspaces.save(workspaceRef.current);
          const commands = workspaceToCommands(workspaceRef.current);
          onWorkspaceChange(state, commands);
        }
      }, 500);
    };

    workspace.addChangeListener(handleChange);
    setIsLoaded(true);

    return () => {
      clearTimeout(debounceTimer);
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [Blockly, toolboxConfig, initialWorkspace, onWorkspaceChange, readOnly, setupCategoryTabs]);

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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
