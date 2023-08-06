import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import SubmitButton from './SubmitButton';
import FilterType from './filterType';

export default function SearchForm() {
  return (
    <Box
      component='form'
      mt={4}
      mb={8}
    >
      <TextField
        id='query'
        label='關鍵字'
        variant='outlined'
        margin='normal'
        sx={{ width: 1 / 3, minWidth: '200px', mx: 2 }}
        helperText='只顯示包含此關鍵字的噗文'
      />
      <TextField
        select
        id='filter'
        label='類型'
        defaultValue='NONE'
        margin='normal'
        sx={{ width: '200px', mx: 2 }}
        helperText='搜尋特定時間軸上的內容'
      >
        {
          FilterType.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        }
      </TextField>
      <TextField
        type='date'
        id='filter'
        label='起始時間'
        InputLabelProps={{ shrink: true }}
        margin='normal'
        sx={{ width: '200px', mx: 2 }}
        helperText='只搜尋此時間以前的時間軸'
      >
      </TextField>
      <br />
      <SubmitButton
        variant='contained'
        size='large'
        endIcon={ <SearchIcon /> }
        sx={{ float: 'right' }}
      >
        搜尋
      </SubmitButton>
    </Box>
  );
};
