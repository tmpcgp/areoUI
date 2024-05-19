import { useState, useRef, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import useHotkeys from "@reecelucas/react-use-hotkeys";

function PaginationControlled({count, setPage, page, configs, size_t_max}) {

  useHotkeys("Control+l", () => {
    // we start @ 1
    console.log("@hitting shotcut key control+l");
    handleChange(null, page + 1 > count ? count : page + 1);
  });
  useHotkeys("Control+h", () => {
    // we start @ 1
    console.log("@hitting shotcut key control+h");
    handleChange(null, page - 1 < 1 ? 1 : page - 1);
  });

  const handleChange = (event, value) => {
    console.log("value >> "+value);
    console.log("count >> "+count);
    setPage(value);
  };
  return (
    <Stack spacing={2}>
      <Pagination 
        color="secondary"
        count={count} 
        page={page}
        onChange={handleChange} />
    </Stack>
  );
}

export default PaginationControlled;
