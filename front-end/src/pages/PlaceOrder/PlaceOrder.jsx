import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login first to proceed to payment.");
      return;
    }

    let orderItems = [];

    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };
    let response = await axios.post(url + "/api/order/place", orderData, {
      headers: { token },
    });

    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("Error");
    }

    //console.log(orderItems);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            type="text"
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            placeholder="Last Name"
            required
          />
        </div>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          placeholder="Email Address"
          required
        />
        <input
          type="text"
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          placeholder="Street"
          required
        />
        <div className="multi-fields">
          <input
            type="text"
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            placeholder="City"
          />
          <input
            type="text"
            name="state"
            value={data.state}
            placeholder="State"
            onChange={onChangeHandler}
            required
          />
        </div>
        <div className="multi-fields">
          <input
            type="text"
            name="zipcode"
            value={data.zipcode}
            onChange={onChangeHandler}
            placeholder="Zip code"
            required
          />
          <input
            type="text"
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            placeholder="Country"
            required
          />
        </div>
        <input
          type="text"
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          placeholder="Phone"
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total:</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
            <button type="submit">Proceed to payment</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
