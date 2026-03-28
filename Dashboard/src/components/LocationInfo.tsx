import { Box, Paper, Typography, Chip } from "@mui/material";
import type { ShineVillage } from "../data/shineVillages";

interface LocationInfoProps {
  village: ShineVillage | null;
}

export default function LocationInfo({ village }: LocationInfoProps) {
  if (!village) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
      <Box sx={{ mb: 1 }}>
        <Chip 
          label={village.shineCode} 
          color="primary" 
          size="small" 
          sx={{ fontWeight: "bold", mb: 1 }}
        />
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">Revenue Village</Typography>
          <Typography variant="body2" fontWeight="bold">{village.revenueVillage}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Panchayat</Typography>
          <Typography variant="body2">{village.panchayat}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Block</Typography>
          <Typography variant="body2">{village.block}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Tehsil</Typography>
          <Typography variant="body2">{village.tehsil}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">District</Typography>
          <Typography variant="body2">{village.district}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">State</Typography>
          <Typography variant="body2">{village.state}</Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
          <Typography variant="caption" color="text.secondary">PRA Team</Typography>
          <Typography variant="body2" fontSize="0.75rem">{village.praTeam}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}