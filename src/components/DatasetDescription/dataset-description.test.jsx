import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatasetDescription from '.';
import * as dataset from "../../tests/fixtures/dataset.json";
import * as distributionWithTitle from "../../tests/fixtures/distributionWithTitle.json"

describe('<DatasetDescription />', () => {
  test("Renders with distribution description over dataset description", () => {
    render(
      <DatasetDescription
        dataset={dataset}
        distribution={distributionWithTitle.distribution[0]}
      />
    );
    expect(screen.getByText("Test Custom Description")).toBeInTheDocument();
  });
  test("Renders dataset description", () => {
    render(
      <DatasetDescription
        dataset={dataset}
        distribution={dataset.distribution[0]}
      />
    );
    expect(screen.getByText("The data below contains newly reported, active covered outpatient drugs which were reported by participating drug manufacturers since the last quarterly update of the Drug Products in the Medicaid Drug Rebate Program (MDRP) database.")).toBeInTheDocument();
  });
  test("Doesn't render when no dataset or distribution is added", () => {
    const { container } = render(<DatasetDescription />);
    expect(container.innerHTML).toBe("");
  });
  test("Render new description if customDescription", () => {
    render(
      <DatasetDescription
        dataset={dataset}
        distribution={distributionWithTitle.distribution[0]}
        customDescription={() => "My custom description."}
      />
    );
    expect(screen.getByText("My custom description.")).toBeInTheDocument();
  });
});