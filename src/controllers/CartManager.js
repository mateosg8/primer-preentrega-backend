import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./ProductManager.js";

const productAll = new ProductManager();

class CartManager {
  constructor() {
    this.path = "./src/models/carts.json";
  }

  readCarts = async () => {
    let carts = await fs.readFile(this.path, "utf8");
    return JSON.parse(carts);
  };

  writeCarts = async (carts) => {
    await fs.writeFile(this.path, JSON.stringify(carts));
  };

  exist = async (id) => {
    let carts = await this.readCarts();
    return carts.find((cart) => cart.id === id);
  };

  addCarts = async () => {
    let cartsOld = await this.readCarts();
    let id = nanoid();
    let cartsConcat = [{ id: id, products: [] }, ...cartsOld];
    await this.writeCarts(cartsConcat);
    return "Carrito Agregado";
  };

  getCartsById = async (id) => {
    let cartById = await this.exist(id);
    if (!cartById) return "Carrito No Encontrado";
    return cartById;
  };

  addProductInCart = async (cartId, productId) => {
    let cartById = await this.exist(cartId);
    if (!cartById) return "Carrito No Encontrado";

    let productById = await productAll.exist(productId);
    if (!productById) return "Producto No Encontrado";

    let cartsAll = await this.readCarts();

    let updatedCart = cartsAll.find((cart) => cart.id === cartId);

    let existingProduct = updatedCart.products.find(
      (prod) => prod.id === productId
    );

    if (existingProduct) {
      existingProduct.cantidad++;
    } else {
      updatedCart.products.push({ id: productId, cantidad: 1 });
    }

    let updatedCarts = cartsAll.map((cart) =>
      cart.id === cartId ? updatedCart : cart
    );

    await this.writeCarts(updatedCarts);

    return "Producto agregado al carrito";
  };
}

export default CartManager;
