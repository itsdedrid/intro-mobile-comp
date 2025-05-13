// components/DatePickerThai.js
import * as React from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from '../dayjsConfig';

export default function DatePickerThai({ value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
      <DateTimePicker
        value={dayjs(value)}
        onChange={(newValue) => onChange(newValue.toISOString())}
        format="D MMMM YYYY HH:mm"
        ampm={false}
        renderInput={(params) => <TextField {...params} size="small" />}
      />
    </LocalizationProvider>
  );
}
