declare module '*.svg?react' {
  import * as React from 'react';

  const Component: React.FC<React.SVGProps<SVGSVGElement>>;
  export default Component;
}

declare module '*.riv' {
  const src: string;
  export default src;
}

declare module '*.json' {
  const value: any;
  export default value;
}
