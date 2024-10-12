import { useState, useEffect, useRef } from "react";
import Table from "react-bootstrap/Table";

import Textbox from "./components/textbox/textbox";
import Dropdown from "./components/dropdown/dropdown";
import CustomButton from "./components/button/button";

import "./App.css";

function formatCurrency(num) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(num);
}

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });
  const nextContainerRef = useRef (null);
  const [txtName, setTxtName] = useState("");
  const [textPrice, setTextPrice] = useState("");
  const [textQuantity, setTextQuantity] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  function handleTextChange(e) {
    const { id, value } = e.target;
    if (id === "txtName") setTxtName(value);
    if (id === "txtPrice") setTextPrice(value);
    if (id === "txtQuantity") setTextQuantity(value);
  }

  function handleTownChange(e) {
    setSelectedTown(e.target.value);
  }

  function handlePaymentMethodChange(e) {
    setSelectedPaymentMethod(e.target.value);
  }

  function addToCart() {
    if (txtName && textPrice && textQuantity) {
      const item = {
        name: txtName,
        price: parseFloat(textPrice),
        quantity: parseInt(textQuantity, 10),
        
        
      
      };

      if (editIndex !== null) {
        const updatedItems = cartItems.map((cartItem, index) =>
          index === editIndex ? item : cartItem
        );
        setCartItems(updatedItems);
        setEditIndex(null);
      } else {
        setCartItems((prevItems) => [...prevItems, item]);
      }

      setTxtName("");
      setTextPrice("");
      setTextQuantity("");
    } else {
      alert("Please fill in all item details.");

      if (nextContainerRef.current) {
        nextContainerRef.current.scrollIntoView({behavior: smooth});
      }
    }
  }

  function deleteItem(itemIndex) {
    const confirmDelete = window.confirm("Do you want to delete this item?");
    if (confirmDelete) {
      const newItems = cartItems.filter((_, index) => index !== itemIndex);
      setCartItems(newItems);


      window.scrollTo({top: 0, behavior: "smooth"});

      
    }
  }

  function editItem(itemIndex) {
    const item = cartItems[itemIndex];
    setTxtName(item.name);
    setTextPrice(item.price.toString());
    setTextQuantity(item.quantity.toString());
    setEditIndex(itemIndex);


    window.scrollTo({top: 0, behavior: "smooth"});
  }

  function clearCart() {
    const confirmClear = window.confirm("Do you want to clear the cart?");
    if (confirmClear) {
      setCartItems([]);
      setSelectedTown("");
      setSelectedPaymentMethod("");
      localStorage.removeItem("cartItems"); 
    }
  }

  const shippingFees = {
    Tubigon: 100,
    Calape: 150,
    Loon: 200,
    Tagbilaran: 250,
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingFee = shippingFees[selectedTown] || 0;
  const grandTotal = subtotal + shippingFee;

  return (
    <div>
      <div className="main-container">
        <div className="sub-container">
          <Textbox
            id="txtName"
            type="text"
            label="Item Name"
            value={txtName}
            containerClass="p-3"
            onTextChange={handleTextChange}
          />
          <Textbox
            id="txtPrice"
            type="number"
            label="Item Price"
            value={textPrice}
            containerClass="p-3"
            onTextChange={handleTextChange}
          />
          <Textbox
            id="txtQuantity"
            type="number"
            label="Quantity"
            value={textQuantity}
            containerClass="p-3"
            onTextChange={handleTextChange}
          />
          <div className="d-flex justify-content-center py-2"
            ref={nextContainerRef}
            >
            <CustomButton
              label={editIndex !== null ? "Update Item" : "Add to Cart"}
              onClick={addToCart}
              variant="dark"
              
            />
          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="item-container my-5 ">
            <h3 className="text-center py-3">𝑪𝑨𝑹𝑻 𝑰𝑻𝑬𝑴𝑺</h3>
            <div className="d-flex my-3">
              <CustomButton label="Clear Cart" onClick={clearCart} variant="dark" />
            </div>

            <Table striped bordered>
              <thead>
                <tr className="text-capitalize">
                  <th>Item #</th>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price * item.quantity)}</td>
                    <td className="text-center" width={240}>
                      <CustomButton
                        label="Edit"
                        variant="light"
                        innerClass="m-1"
                        onClick={() => editItem(index)}
                      />
                      <CustomButton
                        label="Delete"
                        variant="light"
                        innerClass="m-1"
                        onClick={() => deleteItem(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Dropdown
              id="drpTown"
              label="Town"
              options={["Tubigon", "Calape", "Loon", "Tagbilaran"]}
              value={selectedTown}
              containerClass="w-25 p-2"
              onSelectChange={handleTownChange}
            />
            <Dropdown
              id="drpPayment"
              label="Payment Method"
              options={["GCash", "Paymaya", "Paypal"]}
              value={selectedPaymentMethod}
              containerClass="w-25 p-2"
              onSelectChange={handlePaymentMethodChange}
            />

            <div className="py-3">
              <p>Subtotal: {formatCurrency(subtotal)}</p>
              <p>Shipping Fee: {formatCurrency(shippingFee)}</p>
              <p className="atay">Grand Total: {formatCurrency(grandTotal)}</p>
            </div>

            <div className="d-flex justify-content-end my-3"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
