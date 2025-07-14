import { Canvas } from '@/components/canvas';
import { type Edge, type Node, ReactFlowProvider } from '@xyflow/react';

const nodes: Node[] = [
  {
    id: 'primitive-1',
    type: 'text',
    position: { x: 0, y: 0 },
    data: {
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Delphiniums generally symbolize ',
              },
              {
                type: 'text',
                marks: [{ type: 'bold' }],
                text: 'cheerfulness, goodwill, and protection',
              },
              {
                type: 'text',
                text: '. Specifically, they can represent striving for success, enjoying life, and celebrating important occasions. Blue delphiniums are also often associated with dignity and grace.',
              },
            ],
          },
        ],
      },
      text: 'Delphiniums generally symbolize cheerfulness, goodwill, and protection. Specifically, they can represent striving for success, enjoying life, and celebrating important occasions. Blue delphiniums are also often associated with dignity and grace.',
    },
    origin: [0, 0.5],
  },
  {
    id: 'transform-1',
    type: 'audio',
    data: {
      generated: {
        url: '/demo/delphiniums-transform.mp3',
        type: 'audio/mpeg',
      },
    },
    position: { x: 600, y: 100 },
    origin: [0, 0.5],
  },
];

const edges: Edge[] = [
  {
    id: 'edge-1',
    source: 'primitive-1',
    target: 'transform-1',
    type: 'animated',
  },
];

export const SpeechDemo = () => (
  <ReactFlowProvider>
    <Canvas
      nodes={nodes}
      edges={edges}
      panOnScroll={false}
      zoomOnScroll={false}
      preventScrolling={false}
      fitViewOptions={{
        minZoom: 0,
      }}
    />
  </ReactFlowProvider>
);
