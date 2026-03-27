type SpanOpenAPIVersionProps = {
  oasVersion: string;
}

const SpanOpenAPIVersion = function(system: any) {
  return {
    wrapComponents: {
      OpenAPIVersion: (Original: any, system: any) => (props: SpanOpenAPIVersionProps) => {
        const classList = "version version-stamp version-stamp--openapi version-stamp--span";
        let { oasVersion } = props;
        if (typeof system.specSelectors?.isOAS31 === "function") {
          if (system.specSelectors.isOAS31()) {
            return (
              <span className={classList}>
                OAS 3.1
              </span>
            );
          }
        }
        if (typeof system.specSelectors?.isOAS30 === "function") {
          if (system.specSelectors.isOAS30()) {
            return (
              <span className={classList}>
                OAS 3.0
              </span>
            );
          }
        }
        return (
          <span className={classList}>
            { oasVersion }
          </span>
        );
      }
    }
  }
};

export default SpanOpenAPIVersion;
