import React, { useEffect, useState } from "react";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
} from "react-grid-dnd";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { db } from "../firebase";
import firebase from "firebase";
const ProductList = [
  {
    name: "Add",
    description: "Add",
  },
  {
    name: "Product",
    description: "Description 1",
  },
  {
    name: "Product",
    description: "Description 2",
  },
  {
    name: "Product",
    description: "Description 3",
  },
  {
    name: "Product",
    description: "Description 4",
  },
  {
    name: "Product",
    description: "Description 5",
  },
  {
    name: "Product",
    description: "Description 6",
  },
  {
    name: "Product",
    description: "Description 7",
  },
];

function Products() {
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 200,
      minWidth: 200,
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#DF2E2E",
      fontWeight: "900",
      fontSize: "1.5em",
      margin: "2em",

      borderRadius: "7px",
      backgroundColor: "#FFF7AE",
      boxShadow: "15px 8px 15px #F6D167",
    },
    control: {
      padding: theme.spacing(2),
    },
  }));
  const classes = useStyles();
  const [items, setItems] = useState(ProductList);

  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setWidthSize(window.innerWidth);
  }, []);

  function handleResize() {
    setWidthSize(window.innerWidth);
  }
  window.addEventListener("resize", handleResize);
  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    db.collection("products")
      .orderBy("position")
      .onSnapshot((snapshot) =>
        setProducts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);
  console.log(products);
  const onChange = (sourceId, sourceIndex, targetIndex) => {
    // console.log(sourceId);
    if (sourceIndex === 0) {
      console.log("SourceIndex is 0");
      return;
    }
    if (targetIndex === 0) {
      console.log("TARGET index 0");
      return;
    } else {
      const nextState = swap(products, sourceIndex, targetIndex);
      // nextState.forEach((item, index) => {
      //   item["position"] = index;
      // });
      setProducts(nextState);
      nextState.forEach(({ id, data: { name, description } }, index) => {
        db.collection("products").doc(id).update({ position: index });
      });
    }
  };
  const addProduct = (number) => {
    products.push({
      id: `new${number}`,
      data: {
        name: `Product`,
        description: `Description ${number}`,
        position: number,
      },
    });
    // console.log("Activated");
    // console.log(products);
    onChange(products, products.length - 1, products.length);
  };

  const sendPost = (number) => {
    // e.preventDefault();
    db.collection("products").add({
      name: `Product`,
      description: `Description ${number}`,
      position: number,
    });
    onChange(products, products.length - 1, products.length);
  };

  // console.log(widthSize);
  // console.log(items);
  return (
    <ProductsContainer>
      <GridContextProvider onChange={onChange}>
        <GridDropZone
          id="products"
          boxesPerRow={widthSize < 900 ? 2 : widthSize < 1250 ? 3 : 5}
          rowHeight={widthSize < 1250 ? 250 : 300}
          style={{
            height: `${products.length * 10}vh`,
          }}
        >
          {products.map(({ id, data: { name, description } }) =>
            name === "Add" ? (
              <Product
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                key={id}
              >
                <Paper
                  style={{ cursor: "pointer" }}
                  onClick={() => sendPost(products.length)}
                  className={classes.paper}
                >
                  <AddCircleOutlineIcon fontSize={"large"} />
                </Paper>
              </Product>
            ) : (
              <GridItem style={{ width: "fit-content" }} key={id}>
                <Product>
                  <Paper
                    style={{ cursor: "-webkit-grab" }}
                    className={classes.paper}
                  >
                    {name}
                    <br></br>
                    <br></br>
                    {description}
                  </Paper>
                </Product>
              </GridItem>
            )
          )}
        </GridDropZone>
      </GridContextProvider>
    </ProductsContainer>
  );
}

export default Products;

const ProductsContainer = styled.div`
  margin: auto auto;
  width: 80%;
  padding-top: 10em;
`;

const Product = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-start;
  width: 80%;
  height: 100%;
`;
