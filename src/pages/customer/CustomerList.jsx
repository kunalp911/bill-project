import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Box,
  TablePagination,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Sidebar from "../../component/Sidebar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { CSVLink } from "react-csv";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: "100%",
  },
  dialog: {
    width: "auto",
  },
}));

const CustomerList = () => {
  const classes = useStyles();
  const [customersList, setCustomersList] = useState([]);
  const [customer, setCustomer] = useState("");
  const [id, setId] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const [errors, setErrors] = useState();
  const token = localStorage.getItem("@userData");
  const { authToken } = JSON.parse(token);

  console.log("errors", errors);

  useEffect(() => {
    get_Customer_list();
  }, []);

  const get_Customer_list = async () => {
    await axios
      .get(
        "https://reacttestprojectapi.azurewebsites.net/api/CustomerManagement/Customer/GetList",
        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      )
      .then((res) => {
        console.log("response", res?.data);
        setCustomersList(res?.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleAddCustomer = async () => {
    const isValid = validation();
    if (isValid) {      
    const payload = {
      customerName: customer,
    };
    await axios
      .post(
        "https://reacttestprojectapi.azurewebsites.net/api/CustomerManagement/Customer/Insert",
        payload,
        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      )
      .then((res) => {
        res && get_Customer_list();
        handleCloseDialog();
      })
      .catch((err) => {
        console.error(err);
      });
    }
  };

  const handleUpdateCustomer = async () => {
    const payload = {
      customerID: id,
      customerName: customer,
    };
    await axios
      .put(
        "https://reacttestprojectapi.azurewebsites.net/api/CustomerManagement/Customer/Update",
        payload,
        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      )
      .then((res) => {
        res && get_Customer_list();
        setIsEditing(false);
        handleCloseDialog();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDelete = async (id) => {
    await axios
      .delete(
        `https://reacttestprojectapi.azurewebsites.net/api/CustomerManagement/Customer/Delete/${id}`,
        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      )
      .then((res) => {
        res && get_Customer_list();
      })
      .catch((err) => {
        console.error(err);
        toast("Selected Customer exists in some Bills.")
      });
  };

  const handleDeleteCustomer = (id) => {
    Swal
      .fire({
        title: "Are you sure?",
        text: "You won't to delete this customer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#000",
        confirmButtonText: "Yes, delete it!",
        background: "#1e1e1e",
        color: "white",
      })
      .then((result) => {
        if (result.isConfirmed) {
          handleDelete(id);
        }
      });
  };
  
 const validation = () => {
  let newErrors = {};
  if (!customer) {
    newErrors.customer = "Customer name is required";
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
 }
  const handleEditCustomer = (item) => {
    setCustomer(item?.customerName);
    setId(item?.customerID);
    setIsEditing(true);
  };

  const handleOpenAddDialog = () => {
    setIsAdding(true);
  };

  const handleCloseDialog = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCustomer("");
    setErrors();
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <ToastContainer/>
      <Grid sx={{ width: "100%", padding: "20px" }}>
        <Grid>
          <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
            <Grid>
              <Typography variant="h5" component="h2">
                Customer List
              </Typography>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
                onClick={handleOpenAddDialog}
              >
                Add
              </Button>
              <CSVLink data={customersList}>
              <Button
                variant="contained"
                color="primary"
                >
                Print
              </Button>
                </CSVLink>
            </Grid>
          </Grid>
        </Grid>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>S No.</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customersList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                return (
                  <>
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.customerName}</TableCell>
                      <TableCell>
                        <EditIcon onClick={() => handleEditCustomer(item)} />{" "}
                        <DeleteIcon
                          onClick={() => handleDeleteCustomer(item.customerID)}
                        />
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={customersList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog
          open={isAdding || isEditing}
          onClose={handleCloseDialog}
          className={classes.dialog}
        >
          <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
            <DialogTitle>
              {isEditing ? "Edit Customer" : "Add Customer"}
            </DialogTitle>
            <Grid sx={{ padding: "15px", gap: "10px" }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ mr: 1 }}
                onClick={() =>
                  isEditing ? handleUpdateCustomer() : handleAddCustomer()
                }
              >
                Sava
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleCloseDialog}
              >
                Close
              </Button>
            </Grid>
          </Grid>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
             {errors?.customer && <div style={{ color: "red" }}>{errors?.customer}</div>}
          </DialogContent>
        </Dialog>
      </Grid>
    </Box>
  );
};

export default CustomerList;
