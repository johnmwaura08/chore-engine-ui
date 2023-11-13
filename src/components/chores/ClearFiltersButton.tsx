import React from "react";

import { Button } from "devextreme-react";

interface IProps {
  handleClearFilter: () => void;
}

export const ClearFiltersButton: React.FC<IProps> = ({ handleClearFilter }) => (
  <Button icon="filter" onClick={handleClearFilter} hint="Clear filters" />
);
