import { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { supabase } from "./services/supabase";
import RelatedTables from "./components/RelatedTables";
import ShineAutocomplete from "./components/ShineAutocomplete";
import LocationInfo from "./components/LocationInfo";
import logo from "../images/logo.png";
import UsersPage from "./pages/UsersPage";
import type { ShineVillage } from "./data/shineVillages";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

export type Section = "village" | "family" | "users";

export default function App() {
  const [section, setSection] = useState<Section>("village");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<any | null>(null);
  const [selectedShine, setSelectedShine] = useState<ShineVillage | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (section !== "users") {
      loadSessions();
    }
  }, [section, selectedShine]);

  async function loadSessions() {
    setLoading(true);
    try {
      const table = section === "village" ? "village_survey_sessions" : "family_survey_sessions";
      let query = supabase.from(table).select("*").neq("is_deleted", 1);
      
      // SHINE filter ONLY for Family surveys
      if (section === "family" && selectedShine) {
        query = query.eq("village_name", selectedShine.revenueVillage);
      }
      
      const { data, error } = await query.limit(1000);
      if (error) {
        console.warn("Supabase query error:", error);
        setRows([]);
      } else {
        setRows(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = rows.filter((r) =>
    !search ? true : Object.values(r).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const paginatedRows = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const clearShineFilter = () => {
    setSelectedShine(null);
    setSearch("");
    // Reset page when clearing filter
    setPage(0);
  };

  const getStatusChip = (status: string) => {
    const statusColor = status === "completed" ? "success" : status === "in_progress" ? "warning" : "default";
    return <Chip label={status || "N/A"} size="small" color={statusColor} />;
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleString();
    } catch {
      return date;
    }
  };

  // Export village summary function for Family surveys
  const exportVillageSummary = () => {
    if (!selectedShine) {
      alert("Please select a SHINE village first");
      return;
    }

    if (filtered.length === 0) {
      alert(`No family surveys found for ${selectedShine.shineCode} - ${selectedShine.revenueVillage}`);
      return;
    }

    const villageSummary = {
      exportedAt: new Date().toISOString(),
      village: {
        shineCode: selectedShine.shineCode,
        revenueVillage: selectedShine.revenueVillage,
        panchayat: selectedShine.panchayat,
        block: selectedShine.block,
        tehsil: selectedShine.tehsil,
        district: selectedShine.district,
        state: selectedShine.state,
        praTeam: selectedShine.praTeam,
      },
      summary: {
        totalFamilySurveys: filtered.length,
      },
      families: filtered.map((family) => ({
        phoneNumber: family.phone_number,
        headName: family.head_name,
        fatherName: family.father_name,
        villageName: family.village_name,
        district: family.district,
        block: family.block,
        status: family.status,
        surveyDate: family.survey_date,
        createdAt: family.created_at,
      })),
    };

    const jsonString = JSON.stringify(villageSummary, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedShine.shineCode}_${selectedShine.revenueVillage}_family_surveys_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert(`✅ Exported ${filtered.length} family surveys from ${selectedShine.revenueVillage}`);
  };

  // Check if SHINE is selected and we're on Family tab
  const showShineFeatures = section === "family" && selectedShine !== null;

  return (
    <Box sx={{ minHeight: "100vh", p: { xs: 1, md: 4 }, background: "#f5f5f5" }}>
      <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 1, md: 0 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", background: "#fff" }} />
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              DRI PRA Dashboard
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          {section !== "users" && (
            <>
              <Button onClick={() => loadSessions()} variant="outlined" size="small">
                Refresh
              </Button>
              {/* Export button - ONLY when SHINE is selected on Family tab */}
              {showShineFeatures && (
                <Button 
                  variant="contained" 
                  color="success" 
                  onClick={exportVillageSummary}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  📊 Export Village Summary {filtered.length > 0 ? `(${filtered.length})` : "(0)"}
                </Button>
              )}
            </>
          )}
        </Box>

        <Paper sx={{ p: { xs: 1, md: 2 } }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2, flexWrap: "wrap" }}>
            <Tabs value={section} onChange={(_, v) => setSection(v as Section)}>
              <Tab label="Village Surveys" value="village" />
              <Tab label="Family Surveys" value="family" />
              <Tab label="Users" value="users" />
            </Tabs>

            <Box sx={{ flex: 1 }} />

            {section !== "users" && (
              <>
                {/* SHINE Autocomplete - ONLY for Family tab */}
                {section === "family" && (
                  <ShineAutocomplete 
                    onSelect={setSelectedShine}
                    selectedShineCode={selectedShine?.shineCode}
                  />
                )}
                <TextField
                  size="small"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ width: 280 }}
                />
                {/* Clear Filter button - ONLY when SHINE is selected on Family tab */}
                {showShineFeatures && (
                  <Button 
                    size="small" 
                    onClick={clearShineFilter}
                    sx={{ color: "error.main" }}
                  >
                    Clear Filter
                  </Button>
                )}
              </>
            )}
          </Box>

          {/* Location Info Card - ONLY when SHINE is selected on Family tab */}
          {showShineFeatures && (
            <Box sx={{ mb: 2 }}>
              <LocationInfo village={selectedShine} />
            </Box>
          )}

          {section === "users" ? (
            <UsersPage />
          ) : loading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#fafafa" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Session Id</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Surveyor Email</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Updated At</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Village Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>State</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>District</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Block</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Panchayat</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Tehsil</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Ldg Code</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Gps Link</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Shine Code</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Latitude</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Longitude</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Location Timestamp</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Device Info</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>App Version</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Created By</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Updated By</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Is Deleted</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Last Synced At</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Current Version</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Last Edited At</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={26} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            {showShineFeatures 
                              ? `No family surveys found for ${selectedShine?.shineCode} - ${selectedShine?.revenueVillage}`
                              : "No data to display"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedRows.map((row) => {
                        const rowKey = row.id || row.session_id || row.phone_number || Math.random().toString();
                        return (
                          <TableRow key={rowKey} hover>
                            <TableCell sx={{ fontFamily: "monospace", fontSize: "0.7rem" }}>
                              {row.session_id ? row.session_id.substring(0, 12) + "..." : row.id?.substring(0, 8) + "..." || "N/A"}
                            </TableCell>
                            <TableCell>{row.created_by || row.user_email || "N/A"}</TableCell>
                            <TableCell>{formatDate(row.created_at)}</TableCell>
                            <TableCell>{formatDate(row.updated_at)}</TableCell>
                            <TableCell sx={{ fontWeight: 500 }}>{row.village_name || "N/A"}</TableCell>
                            <TableCell>{row.state || "N/A"}</TableCell>
                            <TableCell>{row.district || "N/A"}</TableCell>
                            <TableCell>{row.block || "N/A"}</TableCell>
                            <TableCell>{row.panchayat || "N/A"}</TableCell>
                            <TableCell>{row.tehsil || "N/A"}</TableCell>
                            <TableCell>{row.ldg_code || row.rv_lgd_code || "N/A"}</TableCell>
                            <TableCell>
                              {row.gps_link ? (
                                <a href={row.gps_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.7rem" }}>
                                  View
                                </a>
                              ) : "N/A"}
                            </TableCell>
                            <TableCell>
                              {row.shine_code ? (
                                <Chip 
                                  label={row.shine_code} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ fontFamily: "monospace", fontSize: "0.65rem" }}
                                />
                              ) : "N/A"}
                            </TableCell>
                            <TableCell>{row.latitude || "N/A"}</TableCell>
                            <TableCell>{row.longitude || "N/A"}</TableCell>
                            <TableCell>{formatDate(row.location_timestamp)}</TableCell>
                            <TableCell>{getStatusChip(row.status)}</TableCell>
                            <TableCell>{row.device_info || "N/A"}</TableCell>
                            <TableCell>{row.app_version || "N/A"}</TableCell>
                            <TableCell>{row.created_by || "N/A"}</TableCell>
                            <TableCell>{row.updated_by || "N/A"}</TableCell>
                            <TableCell>{row.is_deleted === 1 ? "Yes" : "No"}</TableCell>
                            <TableCell>{formatDate(row.last_synced_at)}</TableCell>
                            <TableCell>{row.current_version || "N/A"}</TableCell>
                            <TableCell>{formatDate(row.last_edited_at)}</TableCell>
                            <TableCell>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setActiveRow(row);
                                    setDetailsOpen(true);
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Export JSON">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    const exported = { ...row };
                                    delete exported.page_completion_status;
                                    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = `${section}_${row.session_id || row.id || row.phone_number}.json`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                  }}
                                >
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={filtered.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </Paper>

        {section !== "users" && (
          <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} fullWidth maxWidth="xl">
            <DialogTitle>
              Survey Details — {section === "village" ? "Village" : "Family"} Survey — {activeRow?.session_id || activeRow?.phone_number || ""}
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
                {activeRow ? (
                  <RelatedTables
                    tab={section as "village" | "family"}
                    pk={(section === "village" ? activeRow?.session_id : activeRow?.phone_number) ?? ""}
                    keyField={section === "village" ? "session_id" : "phone_number"}
                    onClose={() => setDetailsOpen(false)}
                  />
                ) : null}
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </Box>
  );
}