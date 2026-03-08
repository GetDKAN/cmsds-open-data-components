import React, { useCallback } from 'react'
import { Map, List } from 'immutable'

type ModelsProps = {
  getComponent: (key: string, defaultComponent?: React.ComponentType<unknown>) => React.ComponentType<any>
  specSelectors: {
    isOAS3: () => boolean
    definitions: () => Map<string, unknown>
    specResolvedSubtree: (path: string[]) => unknown
    specJson: () => Map<string, unknown>
  }
  specActions: {
    requestResolvedSubtree: (path: string[]) => void
  }
  layoutSelectors: {
    isShown: (path: string[], defaultVal?: boolean) => boolean
  }
  layoutActions: {
    show: (path: string[], shown: boolean) => void
    readyToScroll: (path: string[], ref: HTMLElement) => void
  }
  getConfigs: () => {
    docExpansion?: string
    defaultModelsExpandDepth?: number
  }
}

const Models: React.FC<ModelsProps> = ({
  specSelectors,
  getComponent,
  layoutSelectors,
  layoutActions,
  specActions,
  getConfigs
}) => {
  const getSchemaBasePath = useCallback(() => {
    const isOAS3 = specSelectors.isOAS3()
    return isOAS3 ? ['components', 'schemas'] : ['definitions']
  }, [specSelectors])

  const getCollapsedContent = useCallback((_name?: string) => ' ', [])

  const handleToggle = useCallback(
    (name: string, isExpanded: boolean) => {
      const specPathBase = getSchemaBasePath()
      layoutActions.show([...specPathBase, name], isExpanded)
      if (isExpanded) {
        specActions.requestResolvedSubtree([...specPathBase, name])
      }
    },
    [getSchemaBasePath, layoutActions, specActions]
  )

  const onLoadModels = useCallback(
    (ref: HTMLElement | null) => {
      if (ref) {
        layoutActions.readyToScroll(getSchemaBasePath(), ref)
      }
    },
    [getSchemaBasePath, layoutActions]
  )

  const onLoadModel = useCallback(
    (ref: HTMLElement | null) => {
      if (ref) {
        const name = ref.getAttribute('data-name')
        if (name) {
          layoutActions.readyToScroll([...getSchemaBasePath(), name], ref)
        }
      }
    },
    [getSchemaBasePath, layoutActions]
  )

  const definitions = specSelectors.definitions()
  const { docExpansion, defaultModelsExpandDepth = 0 } = getConfigs()

  if (!definitions.size || defaultModelsExpandDepth < 0) return null

  const specPathBase = getSchemaBasePath()
  const showModels = layoutSelectors.isShown(
    specPathBase,
    defaultModelsExpandDepth > 0 && docExpansion !== 'none'
  )
  const isOAS3 = specSelectors.isOAS3()

  const ModelWrapper = getComponent('ModelWrapper')
  const Collapse = getComponent('Collapse')
  const ModelCollapse = getComponent('ModelCollapse')
  const JumpToPath = getComponent('JumpToPath')

  return (
    <section className="ApiDocsModels" ref={onLoadModels}>
      <h3>
        <span>{isOAS3 ? 'Schemas' : 'Models'}</span>
      </h3>
      <Collapse isOpened={showModels}>
        {definitions.entrySeq().map(([name]) => {
          const fullPath = [...specPathBase, name]
          const specPath = List(fullPath)

          const schemaValue = specSelectors.specResolvedSubtree(fullPath)
          const rawSchemaValue = specSelectors.specJson().getIn(fullPath)

          const schema = Map.isMap(schemaValue) ? schemaValue : Map()
          const rawSchema = Map.isMap(rawSchemaValue) ? rawSchemaValue : Map()

          const displayName = String(schema.get('title') ?? rawSchema.get('title') ?? name)
          const isShown = layoutSelectors.isShown(fullPath, false)

          if (isShown && schema.size === 0 && rawSchema.size > 0) {
            specActions.requestResolvedSubtree(fullPath)
          }

          const content = (
            <ModelWrapper
              name={name}
              expandDepth={defaultModelsExpandDepth}
              schema={schema || Map()}
              displayName={displayName}
              fullPath={fullPath}
              specPath={specPath}
              getComponent={getComponent}
              specSelectors={specSelectors}
              getConfigs={getConfigs}
              layoutSelectors={layoutSelectors}
              layoutActions={layoutActions}
              includeReadOnly
              includeWriteOnly
            />
          )

          const title = (
            <span className="model-box">
              <span className="model model-title">{displayName}</span>
            </span>
          )

          return (
            <div
              id={`model-${name}`}
              className="model-container"
              key={`models-section-${name}`}
              data-name={name}
              ref={onLoadModel}
            >
              <span className="models-jump-to-path">
                <JumpToPath specPath={specPath} />
              </span>
              <ModelCollapse
                classes="model-box"
                collapsedContent={getCollapsedContent(name)}
                onToggle={handleToggle}
                title={title}
                displayName={displayName}
                modelName={name}
                specPath={specPath}
                layoutSelectors={layoutSelectors}
                layoutActions={layoutActions}
                hideSelfOnExpand
                expanded={defaultModelsExpandDepth > 0 && isShown}
              >
                {content}
              </ModelCollapse>
            </div>
          )
        }).toArray()}
      </Collapse>
    </section>
  )
}

export default Models;
