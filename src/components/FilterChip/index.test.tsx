import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterChip from "./index";

describe("FilterChip", () => {
  const defaultProps = {
    iconClass: "fa fa-filter",
    text: "Test Filter",
    onClick: jest.fn(),
  };

  it("renders correctly", () => {
    render(<FilterChip {...defaultProps} />);
    
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Test Filter");
  });

  it("calls onClick when button is clicked", () => {
    const mockOnClick = jest.fn();
    render(<FilterChip {...defaultProps} onClick={mockOnClick} />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders with different props", () => {
    const customProps = {
      iconClass: "fa fa-search",
      text: "Custom Filter",
      onClick: jest.fn(),
    };
    
    render(<FilterChip {...customProps} />);
    
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Custom Filter");
    
    const icon = button.querySelector("i");
    expect(icon).toHaveClass("fa", "fa-search");
  });

  it("renders close icon", () => {
    render(<FilterChip {...defaultProps} />);
    
    const closeIcon = screen.getByRole("button").querySelector(".fa-xmark");
    expect(closeIcon).toHaveClass("fa", "fa-xmark", "ds-u-font-size--sm", "ds-u-margin-left--1");
  });
});
