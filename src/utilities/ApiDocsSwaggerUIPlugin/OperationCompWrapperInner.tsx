import { ComponentType, useEffect } from "react";
import type { SwaggerUIComponentProps } from './index';

type OperationCompWrapperInnerProps = SwaggerUIComponentProps & {
  Original: ComponentType<SwaggerUIComponentProps>
  onTryoutClick?: () => void
}

const OperationCompWrapperInner = (props: OperationCompWrapperInnerProps) => {
  const { Original, onTryoutClick } = props

  useEffect(() => {
    if (!onTryoutClick) return;

    const timer = setTimeout(() => onTryoutClick(), 2000);

    return () => clearTimeout(timer);
  }, [onTryoutClick]);

  return <Original {...props} />
}

export default OperationCompWrapperInner;
