import { FilterType } from '@/dto/FilterType.enum';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FilterOptions from './FilterOptions';
import SubmitButton from './SubmitButton';

export default function SearchForm({
  query,
  filter,
  offset,
}: {
  query: string
  filter?: FilterType
  offset?: Date
}) {
  const initialDateString = offset?.toLocaleString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

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
        defaultValue={query}
        sx={{ width: 1 / 3, minWidth: '200px', mx: 2 }}
        helperText='只顯示包含此關鍵字的噗文'
      />
      <TextField
        select
        id='filter'
        label='類型'
        defaultValue={FilterOptions[filter ?? FilterType.NONE].value}
        margin='normal'
        sx={{ width: '200px', mx: 2 }}
        helperText='搜尋特定時間軸上的內容'
      >
        {
          Object.values(FilterOptions).map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              { label }
            </MenuItem>
          ))
        }
      </TextField>
      <TextField
        type='date'
        id='filter'
        label='起始時間'
        defaultValue={initialDateString}
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
