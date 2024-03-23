import React, { useEffect, useState } from "react";
import Sidebar from "../../component/Sidebar";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { CSVLink } from "react-csv";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BillList = () => {
  const [billList, setBillList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const token = localStorage.getItem("@userData");
  const { authToken } = JSON.parse(token);

  useEffect(() => {
    get_Bill_list();
  }, []);

  const get_Bill_list = async () => {
    await axios
      .get(
        "https://reacttestprojectapi.azurewebsites.net/api/BillManagement/Bill/GetList",
        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      )
      .then((res) => {
        setBillList(res?.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const delete_Bills = async (id) => {
    await axios
      .delete(
        `https://reacttestprojectapi.azurewebsites.net/api/BillManagement/Bill/Delete/${id}`,
        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      )
      .then((res) => {
        get_Bill_list();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const delete_Bill = (id) => {
    Swal
      .fire({
        title: "Are you sure?",
        text: "You won't to delete this bill!",
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
            delete_Bills(id);
        }
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Grid sx={{ width: "100%", padding: "20px" }}>
        <Grid>
          <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
            <Grid>
              <Typography variant="h5" component="h2">
                Bill List
              </Typography>
            </Grid>
            <Grid>
              <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => navigate("/bill-add")}> 
                Add
              </Button>
              <CSVLink data={billList}>
                <Button variant="contained" color="primary">
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
                <TableCell sx={{ fontWeight: "bold" }}>Bill No</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Bill Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Net Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Remark</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => {
                  return (
                    <>
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.billNo}</TableCell>
                        <TableCell>
                          {moment(item.billDate).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell>{item.customerName}</TableCell>
                        <TableCell>{item.netAmount}</TableCell>
                        <TableCell>
                          <div
                            dangerouslySetInnerHTML={{ __html: item.remarks }}
                          ></div>
                        </TableCell>
                        <TableCell>
                          <EditIcon onClick={() => navigate(`/bill-update/${item.billID}`)}/>{" "}
                          <DeleteIcon
                            onClick={() => delete_Bill(item.billID)}
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
          count={billList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
    </Box>
  );
};

export default BillList;
