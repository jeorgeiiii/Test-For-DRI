import { useState, useEffect } from "react";
import { TextField, Autocomplete, Box, Typography } from "@mui/material";
import { shineVillages } from "../data/shineVillages";
import type { ShineVillage } from "../data/shineVillages";

interface ShineAutocompleteProps {
  onSelect: (village: ShineVillage | null) => void;
  selectedShineCode?: string;
}

export default function ShineAutocomplete({ onSelect, selectedShineCode }: ShineAutocompleteProps) {
  const [value, setValue] = useState<ShineVillage | null>(null);

  useEffect(() => {
    if (selectedShineCode) {
      const found = shineVillages.find(v => v.shineCode === selectedShineCode);
      if (found) {
        setValue(found);
      }
    }
  }, [selectedShineCode]);

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue);
        onSelect(newValue);
      }}
      options={shineVillages}
      getOptionLabel={(option) => `${option.shineCode} - ${option.revenueVillage}`}
      renderOption={(props, option) => {
        // Extract key and separate it from other props
        const { key, ...otherProps } = props;
        return (
          <li key={key} {...otherProps}>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {option.shineCode} - {option.revenueVillage}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {option.block}, {option.district}
              </Typography>
            </Box>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search SHINE Code"
          placeholder="SHINE_001, SHINE_002..."
          size="small"
          sx={{ width: 260 }}
        />
      )}
      filterOptions={(options, { inputValue }) => {
        const search = inputValue.toLowerCase();
        return options.filter(
          (opt) =>
            opt.shineCode.toLowerCase().includes(search) ||
            opt.revenueVillage.toLowerCase().includes(search) ||
            opt.district.toLowerCase().includes(search)
        );
      }}
    />
  );
}