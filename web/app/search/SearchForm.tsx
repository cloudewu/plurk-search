import { FilterType } from '@/dto/FilterType.enum';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { redirect } from 'next/navigation';
import FilterOptions from './FilterOptions';
import SubmitButton from './SubmitButton';
import type { SearchParameters } from './page';

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

  async function submit(formData: FormData) {
    'use server';

    const params: SearchParameters = {};
    const query: string | undefined = formData.get('query')?.toString();
    if (query != null) params.query = query;
    const filter: string | undefined = formData.get('filter')?.toString();
    if (filter != null) params.filter = filter;
    const parsedOffset = Date.parse(formData.get('offset')?.toString() ?? '');
    const offset = !isNaN(parsedOffset) && new Date(parsedOffset).toISOString();
    if (offset !== false) params.offset = offset;

    redirect('/search?' + new URLSearchParams(params as Record<string, string>).toString());
  }

  return (
    <Box
      component='form'
      action={submit as (formData: FormData) => void}
      mt={4}
      mb={8}
    >
      <TextField
        name='query'
        label='關鍵字'
        variant='outlined'
        margin='normal'
        defaultValue={query}
        sx={{ width: 1 / 3, minWidth: '200px', mx: 2 }}
        helperText='只顯示包含此關鍵字的噗文'
      />
      <TextField
        select
        name='filter'
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
        name='offset'
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
        type='submit'
        variant='contained'
        size='large'
        float='right'
        endIcon={ <SearchIcon /> }
      >
        搜尋
      </SubmitButton>
    </Box>
  );
};
