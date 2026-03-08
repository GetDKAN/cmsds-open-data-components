import { ComponentType, useMemo } from "react";
import type { SwaggerUIComponentProps } from './index';

type OperationCompWrapperInnerProps = SwaggerUIComponentProps & {
  Original: ComponentType<SwaggerUIComponentProps>
  onTryoutClick?: () => void
}

const OperationCompWrapperInner = (props: OperationCompWrapperInnerProps) => {
  const { Original, onTryoutClick } = props

  useMemo(() => {
    if (onTryoutClick) {
      setTimeout(() => onTryoutClick(), 2000);
    }
  }, [onTryoutClick]);

  return <Original {...props} />
}

export default OperationCompWrapperInner;
