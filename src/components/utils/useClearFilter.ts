/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const useClearFilter = (dataGridRef: React.MutableRefObject<any>) => {
  const handleClearFilter = () => {
    dataGridRef && dataGridRef.current.instance.clearFilter();
  };
  return {
    handleClearFilter,
  };
};
