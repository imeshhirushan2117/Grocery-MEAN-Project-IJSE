import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import "./OrdersCart.css";
// import { Link} from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function OrdersCart(props) {
  const [orders, setOrders] = useState([]);

  const [email, setEmail] = useState("");

  const [newqtyOnHand, setQtyOnHand] = useState();

  useEffect(() => {
    var a = localStorage.getItem("myValue");
    let parse = JSON.parse(a);
    setOrders(parse);

    var userEmail = localStorage.getItem("formDetails");
    var email = JSON.parse(userEmail);

    setEmail(email);
    console.log(email);
  }, []);

  // console.log(e);
  const handleCheckout = async (itemCode, itemName, itemPrice, qty, amount) => {
    const obj = {
      userEmail: email,
      itemCode: itemCode,
      itemName: itemName,
      qty: qty,
      amount: amount,
    };
    // console.log(obj);

    const uQty = obj.itemCode;

    try {
      await axios
        .post("http://localhost:3500/api/v1/order", {
          obj,
        })
        .then((res) => {
          alert(res.data.message);

          //===========================================================
          axios
            .post("http://localhost:3500/api/v1/getSelectItem", {
              uQty,
            })
            .then((res) => {
              console.log(res.data.qtyOnHand);
              setQtyOnHand(res.data.qtyOnHand);
            })
            .catch((err) => console.log("err"));

          // let i=qtyOnHand
          // console.log()
          axios.put("http://localhost:3500/api/v1/updateItem/" + uQty, {
            itemCode: itemCode,
            itemName: itemName,
            itemPrice: itemPrice,
            qtyOnHand: newqtyOnHand - qty,
          });

          //===============================================================
        })
        .catch((err) => alert(err.response.data.message));
    } catch (err) {
      alert("Failed");
      console.log(err.message);
    }
  };

  const handleViewOrders = (customerEmail) => {
    // console.log(customerEmail)

    window.location.href = `/viewOrders?email=${customerEmail}`;
  };

  return (
    <>
      <Button
        variant="outlined"
        href="#outlined-buttons"
        className="viewBtn"
        onClick={() => handleViewOrders(email)}
      >
        View Orders
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Item Code</StyledTableCell>
              <StyledTableCell align="right">Item Name</StyledTableCell>
              <StyledTableCell align="right">Quantity</StyledTableCell>
              <StyledTableCell align="right">Amount</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <StyledTableRow key={order}>
                <StyledTableCell component="th" scope="row">
                  {order.itemCode}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {order.itemName}
                </StyledTableCell>
                <StyledTableCell align="right">{order.qty}</StyledTableCell>
                <StyledTableCell align="right">{order.amount}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {orders.map((order) => (
        <div>
          <h1 className="fs-2">Total Price:{order.amount}</h1>
        </div>
      ))}

      {orders.map((order) => (
        <Button
          type="submit"
          onClick={() => {
            handleCheckout(
              order.itemCode,
              order.itemName,
              order.itemPrice,
              order.qty,
              order.amount
            );
          }}
          variant="contained"
        >
          Check Out
        </Button>
      ))}
    </>
  );
}
