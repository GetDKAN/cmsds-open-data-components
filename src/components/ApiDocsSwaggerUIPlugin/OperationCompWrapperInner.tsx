import { useMemo } from "react";

type OperationCompWrapperInnerProps = {
  Original: any
  onTryoutClick: () => void
}

const OperationCompWrapperInner = (props: OperationCompWrapperInnerProps) => {
  const { Original, onTryoutClick } = props

  useMemo(() => {
    setTimeout(() => {
      onTryoutClick()
    }, 2000)
  }, [onTryoutClick])

  return <Original {...props} />
}

export default OperationCompWrapperInner;
