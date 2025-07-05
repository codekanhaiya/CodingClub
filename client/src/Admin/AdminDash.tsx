import * as React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
  TablePagination,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { jwtDecode } from "jwt-decode";

// Custom Alert component for Snackbar
const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

// Decode admin token
const token = localStorage.getItem("token");
let tokenData: any = null;
if (token) {
  try {
    tokenData = jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
  }
}

const AdminDashboard = () => {
  // State management
  const [openEmailDialog, setOpenEmailDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedStudentEmail, setSelectedStudentEmail] = React.useState<
    string | null
  >(null);
  const [selectedStudentId, setSelectedStudentId] = React.useState<
    string | null
  >(null);
  const [students, setStudents] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [emailSubject, setEmailSubject] = React.useState("");
  const [emailContent, setEmailContent] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");

  // Fetch all students on mount
  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/students");
        if (!response.ok) throw new Error("Failed to fetch students!");
        const data = await response.json();
        setStudents(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setSnackbarSeverity("success");
    setSnackbarMessage("Logged out successfully.");
    setSnackbarOpen(true);
    setTimeout(() => window.location.reload(), 2000);
  };

  // Handle sending email
  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Email subject and content cannot be empty.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedStudentEmail,
          subject: emailSubject,
          content: emailContent,
        }),
      });

      if (!response.ok) {
        const errorMsg =
          response.status === 404
            ? "Email address not found."
            : "Failed to send email.";
        throw new Error(errorMsg);
      }

      setSnackbarSeverity("success");
      setSnackbarMessage("Email sent successfully.");
    } catch (err: any) {
      setSnackbarSeverity("error");
      setSnackbarMessage(err.message);
    } finally {
      setSnackbarOpen(true);
      setOpenEmailDialog(false);
      setEmailContent("");
      setEmailSubject("");
    }
  };

  // Handle delete
  const confirmDelete = async () => {
    if (!selectedStudentId) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/students/${selectedStudentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete student!");
      setSnackbarSeverity("success");
      setSnackbarMessage("Student deleted successfully.");
      setStudents((prev) => prev.filter((s) => s._id !== selectedStudentId)); // Optimistic update
    } catch (err: any) {
      setSnackbarSeverity("error");
      setSnackbarMessage(err.message);
    } finally {
      setSnackbarOpen(true);
      setOpenDeleteDialog(false);
      setSelectedStudentId(null);
    }
  };

  // Handle search, pagination
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const filteredStudents = students.filter((student) =>
    Object.values(student).some((value) =>
      String(value).toLowerCase().startsWith(searchQuery.toLowerCase())
    )
  );
  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Avatar sx={{ mr: 2, bgcolor: "#1976d2" }}>A</Avatar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout} color="inherit">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Admin Info */}
      <Box sx={{ mt: 2, mb: 2 }}>
        {tokenData ? (
          <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2 }}>
            <Typography>
              <strong>Email:</strong> {tokenData.email}
            </Typography>
          </Box>
        ) : (
          <Typography color="error">
            Admin not found or token is invalid.
          </Typography>
        )}
      </Box>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <Typography variant="h5" sx={{ mb: 2 }}>
        Student Data
      </Typography>

      {/* Table */}
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr. No.</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Roll Number</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStudents.map((student, index) => (
                <TableRow key={student._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{`${student.course} ${student.subField}`}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>
                    <Tooltip title="Send Email">
                      <IconButton
                        onClick={() => {
                          setSelectedStudentEmail(student.email);
                          setOpenEmailDialog(true);
                        }}
                      >
                        <SendIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Student">
                      <IconButton
                        onClick={() => {
                          setSelectedStudentId(student._id);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredStudents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Email Dialog */}
      <Dialog open={openEmailDialog} onClose={() => setOpenEmailDialog(false)}>
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the subject and content for the email to{" "}
            <strong>{selectedStudentEmail}</strong>.
          </DialogContentText>
          <TextField
            margin="dense"
            label="Email Subject"
            fullWidth
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email Content"
            fullWidth
            multiline
            rows={4}
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmailDialog(false)}>Cancel</Button>
          <Button onClick={handleSendEmail} variant="contained">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this student?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
