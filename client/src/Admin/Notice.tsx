import * as React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

// Alert component using MuiAlert
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AdminNoticeBoard = () => {
  //State Hooks
  const [notice, setNotice] = React.useState("");
  const [notices, setNotices] = React.useState<any[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = React.useState<string | null>(
    null
  );
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");

  //Fetch notices from the server
  const fetchNotices = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/notices");
      if (!response.ok) throw new Error("Failed to fetch notices.");
      const data = await response.json();

      //Sort by most recent
      const sorted = data.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setNotices(sorted);
      setErrorMessage(null);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred.");
    }
  };

  //Add new notice
  const handleAddNotice = async () => {
    if (!notice.trim()) {
      setSnackbarMessage("Please enter a notice before submitting.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: notice.trim() }),
      });

      if (!response.ok) throw new Error("Failed to add notice.");

      const savedNotice = await response.json();
      setNotices([savedNotice, ...notices]); // Optimistic insert
      setNotice("");
      setSnackbarMessage("Notice added successfully!");
      setSnackbarSeverity("success");
    } catch (err: any) {
      setSnackbarMessage(err.message || "Error adding notice.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  //Prepare deletion
  const handleDeleteClick = (id: string) => {
    setSelectedNoticeId(id);
    setOpenConfirmDialog(true);
  };

  //Confirm deletion
  const handleConfirmDelete = async () => {
    if (!selectedNoticeId) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/notices/${selectedNoticeId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete notice.");

      setNotices(notices.filter((n) => n._id !== selectedNoticeId));
      setSnackbarMessage("Notice deleted successfully!");
      setSnackbarSeverity("success");
    } catch (err: any) {
      setSnackbarMessage(err.message || "Error deleting notice.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      setOpenConfirmDialog(false);
      setSelectedNoticeId(null);
    }
  };

  //Snackbar close
  const handleSnackbarClose = () => setSnackbarOpen(false);

  //Confirmation Dialog close
  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedNoticeId(null);
  };

  //Fetch notices on mount
  React.useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <CssBaseline />

      {/*App Header */}
      <AppBar position="static">
        <Toolbar>
          <Avatar sx={{ mr: 2 }}>A</Avatar>
          <Typography variant="h6">Admin Notice Board</Typography>
        </Toolbar>
      </AppBar>

      {/*Add Notice Form */}
      <Box sx={{ m: 4 }}>
        <Typography variant="h5" gutterBottom>
          Publish a New Notice
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Notice Message"
            variant="outlined"
            fullWidth
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
          />
          <Tooltip title="Publish Notice">
            <IconButton color="primary" onClick={handleAddNotice}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/*Notices List */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Published Notices
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Sr. No.
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Message
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Date
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {errorMessage ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{ color: "error.main" }}
                >
                  {errorMessage}
                </TableCell>
              </TableRow>
            ) : notices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No notices available.
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice, index) => (
                <TableRow
                  key={notice._id}
                  hover
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                    "&:hover": { backgroundColor: "#e3f2fd" },
                  }}
                >
                  <TableCell>{notices.length - index}</TableCell>
                  <TableCell>{notice.message}</TableCell>
                  <TableCell>
                    {new Date(notice.date).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(notice._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/*Delete Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this notice? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/*Snackbar Feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminNoticeBoard;
