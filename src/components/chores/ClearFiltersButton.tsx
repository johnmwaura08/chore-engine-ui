import type { FC } from 'react';

import { Button } from 'devextreme-react';

interface IProps {
  handleClearFilter: () => void;
}

export const ClearFiltersButton: FC<IProps> = ({ handleClearFilter }) => (
  <Button icon="filter" onClick={handleClearFilter} hint="Clear filters" />
);
