import "./Orders.css";
import { React, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const res = await axios.get(url + "/api/order/list");
    if (res.data.success) {
      setOrders(res.data.data);
      console.log(res.data.data);
    } else {
      toast.error("Error");
    }
  };

  const statusHandler = async (e, orderId) => {
    console.log(e, orderId);
    const res = await axios.post(url + "/api/order/status", {
      orderId,
      status: e.target.value,
    });

    if (res.data.success) {
      await fetchAllOrders();
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => {
          return (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + " ,";
                    }
                  })}
                </p>
                <p className="order-item-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street + " ,"}</p>
                  <p>
                    {order.address.city +
                      " ," +
                      order.address.state +
                      " ," +
                      order.address.country +
                      " ," +
                      order.address.zipcode}
                  </p>
                  <p className="order-item-phone">{order.address.phone}</p>
                </div>
                <p>Item: {order.items.length}</p>
                <p>${order.amount}</p>
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                >
                  <option value="Food processing">processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Food delivered">Food delivered</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
