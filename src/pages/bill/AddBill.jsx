import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
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
  TableRow,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Sidebar from "../../component/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddBill = () => {
  const [open, setOpen] = React.useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [billNo, setBillNo] = useState("");
  const [date, setDate] = useState("");
  const [remark, setRemark] = useState("");
  const [description, setDescription] = useState("");
  const [qty, setQty] = useState("");
  const [rate, setRate] = useState("");
  const [discount, setDiscount] = useState("");
  const [unit, setUnit] = useState("");
  const [amount, setAmount] = useState();
  const [itemData, setItemData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [errors, setErrors] = useState();
  const [opens, setOpens] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("@userData");
  const { authToken } = JSON.parse(token);

  const totalAmount = itemData?.reduce(
    (total, item) => total + parseFloat(item?.amount),
    0
  );
  const totalDiscount = itemData?.reduce(
    (total, item) => total + parseFloat(item?.discAmt),
    0
  );
  const totalBillAmount = (totalAmount * totalDiscount) / 100;

  useEffect(() => {
    get_Customer_list();
    get_Bill_no();
  }, []);

  const handleCustomerSelect = (event, value) => {
    setSelectedCustomer(value);
  };

  const calculateAmount = () => {
    return rate * qty - (rate * qty * discount) / 100;
  };
  const handleChange = (e) => {
    setAmount(calculateAmount());
  };
  const handleItem = () => {
    // const validate = validation();
    // if (validate) {
      const newItemData = {
        descr: description,
        unit: unit,
        qty: parseFloat(qty),
        rate: parseFloat(rate),
        discAmt: parseFloat(discount),
        amount: amount,
      };
      setItemData((prev) => [...prev, newItemData]);
      setDescription("");
      setAmount("");
      setUnit("");
      setQty("");
      setRate("");
      setDiscount("");
      handleClose();
    // }
  };

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
        setCustomerList(res?.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const get_Bill_no = async () => {
    await axios
      .get(
        "https://reacttestprojectapi.azurewebsites.net/api/BillManagement/Bill/GenerateBillNo",
        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      )
      .then((res) => {
        setBillNo(res?.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const add_Bill = async () => {
    setOpens(true);
    const payload = {
      billNo: billNo,
      billDate: date,
      Remarks: remark,
      customerID: selectedCustomer?.id,
      netAmount: totalAmount - totalBillAmount,
      totalDiscountAmount: totalBillAmount,
      billItems: itemData,
    };
    await axios
      .post(
        "https://reacttestprojectapi.azurewebsites.net/api/BillManagement/Bill/Insert",
        payload,
        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      )
      .then((res) => {
        res && navigate("/bill-list");
        setOpens(false);
      })
      .catch((err) => {
        console.error(err);
        setOpens(false);
      });
  };

  const validation = () => {
    let newErrors = {};
    if (!description) {
      newErrors.description = "Description is required";
    }
    if (!unit) {
      newErrors.unit = "Unit is required";
    }
    if (!qty) {
      newErrors.qty = "Qty is required";
    }
    if (!rate) {
      newErrors.rate = "Rate is required";
    }
    if (!discount) {
      newErrors.discount = "Discount is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleCloses = () => {
    setOpens(false);
  };
  return (
    <Box display="flex">
      <Sidebar />
      <Grid sx={{ width: "100%", padding: "20px" }}>
        <Grid>
          <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
            <Grid>
              <Typography variant="h5" component="h2">
                Add Bill
              </Typography>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
                onClick={handleClickOpen}
              >
                Add Item
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
                onClick={add_Bill}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/bill-list")}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Box component={Paper} sx={{ mt: 2 }}>
          <Grid>
            <form>
              <Grid>
                <Grid sx={{ display: "flex", justifyContent: "space-around" }}>
                  <TextField
                    autoFocus
                    margin="dense"
                    name="Bill No"
                    label="Bill No"
                    type="text"
                    size="small"
                    value={billNo}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    type="date"
                    size="small"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Grid>
                <Grid sx={{ display: "flex", textAlign: "center" }}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={customerList?.map((item) => ({
                      id: item.customerID,
                      name: item.customerName,
                    }))}
                    getOptionLabel={(option) => option.name}
                    fullWidth
                    onChange={handleCustomerSelect}
                    value={selectedCustomer}
                    size="small"
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField {...params} sx={{ width: "70%" }} />
                    )}
                  />
                </Grid>
                <Grid sx={{ display: "flex", textAlign: "center" }}>
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            S No.
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Discription
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Unit
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Rate
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Qty</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Discount
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Amount
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {itemData?.map((item, index) => (
                          <TableRow>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.descr}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{item.rate}</TableCell>
                            <TableCell>{item.qty}</TableCell>
                            <TableCell>{item.discAmt}%</TableCell>
                            <TableCell>
                              {item.rate * item.qty -
                                (item.rate * item.qty * item.discAmt) / 100}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Grid>
                    <TextareaAutosize
                      minRows={5}
                      placeholder="Remark"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                    />
                  </Grid>
                  <Grid sx={{ display: "grid" }}>
                    <TextField
                      type="text"
                      size="small"
                      placeholder="Total amount"
                      value={totalAmount}
                    />
                    <TextField
                      type="text"
                      size="small"
                      placeholder="Discount"
                      value={(totalBillAmount).toFixed(2)}
                    />
                    <TextField
                      type="text"
                      size="small"
                      placeholder="Net amount"
                      value={(totalAmount - totalBillAmount).toFixed(2)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Box>
        <Dialog
          open={open}
          onClose={handleClose}
          //   className={classes.dialog}
        >
          <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
            <DialogTitle>Add Item</DialogTitle>
            <Grid sx={{ padding: "15px", gap: "10px" }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ mr: 1 }}
                onClick={handleItem}
              >
                Sava
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleClose}
              >
                Close
              </Button>
            </Grid>
          </Grid>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Unit"
              type="text"
              fullWidth
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Qty"
              type="number"
              fullWidth
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Rate"
              type="number"
              fullWidth
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Discount"
              type="number"
              fullWidth
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              onBlur={handleChange}
            />
            <TextField
              autoFocus
              margin="dense"
              type="number"
              fullWidth
              disabled
              value={rate * qty - (rate * qty * discount) / 100}
              onChange={(e) => setAmount(e.target.value)}
            />
          </DialogContent>
        </Dialog>
        <Backdrop
        open={opens}
        onClick={handleCloses}
        style={{ backgroundColor: "white" }}
      >
        <CircularProgress  />
      </Backdrop>
      </Grid>
    </Box>
  );
};

export default AddBill;
