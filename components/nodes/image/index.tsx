import { useNodeConnections } from '@xyflow/react';
import { ImagePrimitive } from './primitive';
import { ImageTransform } from './transform';

export type ImageNodeProps = {
  type: string;
  data: {
    content?: {
      url: string;
      type: string;
    };
    generated?: {
      url: string;
      type: string;
    };
    size?: string;
    width?: number;
    height?: number;
    updatedAt?: string;
    model?: string;
    description?: string;
    instructions?: string;
  };
  id: string;
};

export const ImageNode = (props: ImageNodeProps) => {
  const connections = useNodeConnections({
    id: props.id,
    handleType: 'target',
  });
  const Component = connections.length ? ImageTransform : ImagePrimitive;

  return <Component {...props} title="Image" />;
};
