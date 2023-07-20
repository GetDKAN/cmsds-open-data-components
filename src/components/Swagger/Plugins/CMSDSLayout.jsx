import React from "react";

const CMSDSLayout = ({errSelectors, specSelectors, getComponent}) => {
  const BaseLayout = getComponent("BaseLayout", true);
  const SvgAssets = getComponent("SvgAssets")
    const InfoContainer = getComponent("InfoContainer", true)
    const VersionPragmaFilter = getComponent("VersionPragmaFilter")
    const Operations = getComponent("operations", true)
    const Models = getComponent("Models", true)
    const Webhooks = getComponent("Webhooks", true)
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const Errors = getComponent("errors", true)

    const ServersContainer = getComponent("ServersContainer", true)
    const SchemesContainer = getComponent("SchemesContainer", true)
    const AuthorizeBtnContainer = getComponent("AuthorizeBtnContainer", true)
    const FilterContainer = getComponent("FilterContainer", true)
    const isSwagger2 = specSelectors.isSwagger2()
    const isOAS3 = specSelectors.isOAS3()
    // const isOAS31 = specSelectors.isOAS31()

    const isSpecEmpty = !specSelectors.specStr()

    const loadingStatus = specSelectors.loadingStatus()

    let loadingMessage = null

    if (loadingStatus === "loading") {
      loadingMessage = (
        <div className="info">
          <div className="loading-container">
            <div className="loading"></div>
          </div>
        </div>
      )
    }

    if (loadingStatus === "failed") {
      loadingMessage = (
        <div className="info">
          <div className="loading-container">
            <h4 className="title">Failed to load API definition.</h4>
            <Errors />
          </div>
        </div>
      )
    }

    if (loadingStatus === "failedConfig") {
      const lastErr = errSelectors.lastError()
      const lastErrMsg = lastErr ? lastErr.get("message") : ""
      loadingMessage = (
        <div className="info failed-config">
          <div className="loading-container">
            <h4 className="title">Failed to load remote configuration.</h4>
            <p>{lastErrMsg}</p>
          </div>
        </div>
      )
    }

    if (!loadingMessage && isSpecEmpty) {
      loadingMessage = <h4>No API definition provided.</h4>
    }

    if (loadingMessage) {
      return (
        <div className="swagger-ui">
          <div className="loading-container">{loadingMessage}</div>
        </div>
      )
    }

    const servers = specSelectors.servers()
    const schemes = specSelectors.schemes()

    const hasServers = servers && servers.size
    const hasSchemes = schemes && schemes.size
    const hasSecurityDefinitions = !!specSelectors.securityDefinitions()

    return (
      <div className="swagger-ui ds-l-row">
       <SvgAssets />
         {/* <VersionPragmaFilter
          isSwagger2={isSwagger2}
          isOAS3={isOAS3}
          alsoShow={<Errors />}
        > */}
          {/* <Errors /> */}
          <div className="">
            <h2>Try the API</h2>
          </div>
          {/* <Row className="information-container">
            <Col mobile={12}>
              <InfoContainer />

            </Col>
          </Row> */}

          {/* {hasServers || hasSchemes || hasSecurityDefinitions ? (
            <div className="scheme-container">
              <Col className="schemes wrapper" mobile={12}>
                {hasServers ? <ServersContainer /> : null}
                {hasSchemes ? <SchemesContainer /> : null}
                {hasSecurityDefinitions ? <AuthorizeBtnContainer /> : null}
              </Col>
            </div>
          ) : null} */}

          {/* <FilterContainer /> */}
          <div>
            <Operations />
          </div>
          {/* <Row>
            <Col mobile={12} desktop={12}>
              <Operations />
            </Col>
          </Row> */}

          {/* {isOAS31 && (
            <Row className="webhooks-container">
              <Col mobile={12} desktop={12}>
                <Webhooks />
              </Col>
            </Row>
          )} */}

          {/* <Row>
            <Col mobile={12} desktop={12}>
              <Models />
            </Col>
          </Row>
        </VersionPragmaFilter> */}
      </div>
    )
};

export default CMSDSLayout;