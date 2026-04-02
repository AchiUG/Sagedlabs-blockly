'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Standalone Blockly test page.
 * - Zero imports from /components/blocks-lab
 * - Blockly loaded dynamically; custom blocks defined inline
 * - Fixed 700px-tall container; no flex/overflow trickery
 * - Global CSS has NO effect — we scope everything here
 */
export default function BlocklyLabPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Loading Blockly…');
  const workspaceRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 1. Import Blockly
        const Blockly = await import('blockly');
        await import('blockly/blocks');
        if (cancelled) return;

        // 2. Register ONE custom block so we have something to show
        if (!Blockly.Blocks['test_on_start']) {
          Blockly.Blocks['test_on_start'] = {
            init(this: any) {
              this.appendDummyInput().appendField('🟢 On Start');
              this.setNextStatement(true);
              this.setColour('#FFAB19');
              this.setTooltip('Runs once when you press Run');
            },
          };
        }
        if (!Blockly.Blocks['test_say']) {
          Blockly.Blocks['test_say'] = {
            init(this: any) {
              this.appendValueInput('TEXT').setCheck('String').appendField('say');
              this.setPreviousStatement(true);
              this.setNextStatement(true);
              this.setColour('#9966FF');
              this.setTooltip('Display a speech bubble');
            },
          };
        }

        if (!containerRef.current || cancelled) return;

        // 3. Toolbox — simple two-category setup
        const toolbox = {
          kind: 'categoryToolbox',
          contents: [
            {
              kind: 'category',
              name: '🟢 Events',
              colour: '#FFAB19',
              contents: [{ kind: 'block', type: 'test_on_start' }],
            },
            {
              kind: 'category',
              name: '🟣 Looks',
              colour: '#9966FF',
              contents: [
                {
                  kind: 'block',
                  type: 'test_say',
                  inputs: {
                    TEXT: {
                      shadow: { type: 'text', fields: { TEXT: 'Hello!' } },
                    },
                  },
                },
              ],
            },
          ],
        };

        // 4. Inject Blockly — plain config, no fancy options
        const workspace = Blockly.inject(containerRef.current, {
          toolbox,
          grid: { spacing: 20, length: 3, colour: '#ddd', snap: true },
          trashcan: true,
          zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
          },
          move: { scrollbars: true, drag: true, wheel: true },
        });

        workspaceRef.current = workspace;

        // 5. Log diagnostics
        const tb = workspace.getToolbox() as any;
        const fl = workspace.getFlyout() as any;
        const items = tb?.getToolboxItems?.() || [];
        console.log('[blockly-lab] toolbox items:', items.length);
        console.log('[blockly-lab] flyout:', fl?.constructor?.name);
        console.log('[blockly-lab] autoClose:', (fl as any)?.autoClose);

        items.forEach((item: any, i: number) => {
          console.log(`[blockly-lab] item ${i}: ${item.name_}, flyoutItems: ${item.flyoutItems_?.length}`);
        });

        setStatus(`Blockly ready — ${items.length} categories loaded`);

        // 6. Resize listener
        const onResize = () => Blockly.svgResize(workspace);
        window.addEventListener('resize', onResize);

        return () => {
          window.removeEventListener('resize', onResize);
        };
      } catch (err: any) {
        console.error('[blockly-lab] init error:', err);
        if (!cancelled) setStatus('Error: ' + err.message);
      }
    })();

    return () => {
      cancelled = true;
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        /* Strip ALL inherited styles — act like a standalone HTML page */
        all: 'initial',
        fontFamily: 'system-ui, sans-serif',
        display: 'block',
        padding: '16px',
        backgroundColor: '#f9fafb',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
        🧪 Standalone Blockly Lab (isolated test)
      </h1>
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
        Status: {status}
      </p>
      <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
        Click &quot;Events&quot; or &quot;Looks&quot; in the left toolbox to open the flyout.
      </p>

      {/* FIXED height container — no flex, no overflow:hidden, no relative/absolute tricks */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '700px',
          border: '2px solid #d1d5db',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
        }}
      />
    </div>
  );
}
