type SpanStampsProps = {
  version: string;
}

const SpanVersionStamp = function(system: any) {
  return {
    wrapComponents: {
      VersionStamp: (Original: any, system: any) => (props: SpanStampsProps) => {
        const classList = "version version-stamp version-stamp--span";
        const { version } = props;
        return (
          <span className={classList}>
            { version }
          </span>
        );
      },
    }
  }
}

export default SpanVersionStamp;
