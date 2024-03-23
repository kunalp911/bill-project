// import { Box, Grid } from "@mui/material";
// import React from "react";
// import Sidebar from "../../component/Sidebar";

// const UpdateBill = () => {
//   return (
//     <Box display="flex">
//       <Sidebar />
//       <Grid sx={{ width: "100%", padding: "20px" }}>
//         <Grid>nvnvvnnvnvnvn</Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default UpdateBill;

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalAm, setTotalAm] = useState(null);
  const [totalDis, setTotalDis] = useState(null);
  const [totalDisAmt, setTotalDisAmt] = useState(null);
  const token = localStorage.getItem("@userData");
  const { authToken } = JSON.parse(token);

  const udateTotal = () => {
    setTotalDis(
      bill?.billItems?.reduce((a, b) => Number(a) + Number(b.discAmt), 0)
    );
    setTotalAm(bill?.billItems?.reduce((a, b) => a + +b.amount, 0));
  };

  const handleUpdate = async () => {
    setTotalDisAmt((totalAm * totalDis) / 100);
  };


  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await axios.get(
          `https://reacttestprojectapi.azurewebsites.net/api/BillManagement/Bill/GetModel/${id}`,
          {
            headers: {
              Authorization: "Bearer " + authToken,
            },
          }
        );
        setBill(response?.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBill();
  }, [id]);

  const handleChange = (e, index, field) => {
    const newBillItems = [...bill.billItems];
    newBillItems[index][field] = e.target.value;
    setBill({ ...bill, billItems: newBillItems });
  };

  useEffect(() => {
    udateTotal();
    handleUpdate();
  }, [bill, totalAm, totalDis, handleChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `https://reacttestprojectapi.azurewebsites.net/api/BillManagement/Bill/Update`,
        bill,
        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      );
      if (response.data) {
        setLoading(false);
        navigate("/bill-list");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box m={5}>
      <Card variant="outlined">
        <CardContent>
          <Box mb={3}>
            <Typography variant="h4" gutterBottom>
              Update Bill
            </Typography>
          </Box>
          <Box mt={3}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    value={bill?.billNo}
                    onChange={(e) =>
                      setBill({ ...bill, billNo: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    value={bill?.billDate}
                    onChange={(e) =>
                      setBill({ ...bill, billDate: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    defaultValue={bill?.netAmount}
                    value={totalAm}
                    disabled
                    onChange={(e) =>
                      setBill({ ...bill, netAmount: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    defaultChecked={bill?.totalDiscountAmount}
                    value={totalDisAmt}
                    disabled
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        totalDiscountAmount: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    value={bill?.remarks}
                    onChange={(e) =>
                      setBill({ ...bill, Remarks: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Bill Items</Typography>
                  <Box mt={2}>
                    {bill?.billItems?.map((billItem, index) => (
                      <Box
                        key={billItem.descr}
                        mb={2}
                        display="flex"
                        alignItems="center"
                      >
                        <Box mr={2} flexGrow={1}>
                          <TextField
                            fullWidth
                            label="Description"
                            value={billItem.descr}
                            onChange={(e) => handleChange(e, index, "descr")}
                          />
                        </Box>
                        <Box mr={2} flexGrow={1}>
                          <TextField
                            fullWidth
                            label="Unit"
                            value={billItem.unit}
                            onChange={(e) => handleChange(e, index, "unit")}
                          />
                        </Box>
                        <Box mr={2} flexGrow={1}>
                          <TextField
                            fullWidth
                            label="Quantity"
                            value={billItem.qty}
                            onChange={(e) => handleChange(e, index, "qty")}
                          />
                        </Box>
                        <Box mr={2} flexGrow={1}>
                          <TextField
                            fullWidth
                            label="Rate"
                            value={billItem.rate}
                            onChange={(e) => handleChange(e, index, "rate")}
                          />
                        </Box>
                        <Box mr={2} flexGrow={1}>
                          <TextField
                            fullWidth
                            label="Discount Amount"
                            value={billItem.discAmt}
                            onChange={(e) => handleChange(e, index, "discAmt")}
                          />
                        </Box>
                        <Box mr={2} flexGrow={1}>
                          <TextField
                            fullWidth
                            label="Amount"
                            value={
                              billItem.rate * billItem.qty -
                              (billItem.rate *
                                billItem.qty *
                                billItem.discAmt) /
                                100
                            }
                            onChange={(e) => handleChange(e, index, "amount")}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={20} /> : "Update Bill"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UpdateBill;
