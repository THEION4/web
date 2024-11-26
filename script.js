let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const addToCartButtons = document.querySelectorAll('.add-to-cart');
const carritoBody = document.getElementById('carrito-body');
const totalCarrito = document.getElementById('total-carrito');

// Añadir productos al carrito
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const product = button.getAttribute('data-product');
        const price = parseFloat(button.getAttribute('data-price'));
        const image = button.getAttribute('data-image');

        const item = carrito.find(p => p.product === product);
        if (item) {
            item.quantity += 1;
        } else {
            carrito.push({ product, price, quantity: 1, image });
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
    });
});

// Actualizar el carrito en la página del carrito.html
function actualizarCarrito() {
    carritoBody.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.product}" width="50"></td>
            <td>${item.product}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <input type="number" class="quantity" data-product="${item.product}" min="1" value="${item.quantity}">
            </td>
            <td class="total-item">$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="remove-item" data-product="${item.product}">Eliminar</button></td>
        `;

        total += item.price * item.quantity;
        carritoBody.appendChild(row);
    });

    totalCarrito.innerText = total.toFixed(2);

    // Event listener para eliminar productos
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            carrito = carrito.filter(item => item.product !== product);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            actualizarCarrito();
        });
    });

    // Event listener para actualizar cantidades
    document.querySelectorAll('.quantity').forEach(input => {
        input.addEventListener('change', (e) => {
            const product = e.target.getAttribute('data-product');
            const quantity = parseInt(e.target.value);

            const item = carrito.find(p => p.product === product);
            if (item && quantity > 0) {
                item.quantity = quantity;
                localStorage.setItem('carrito', JSON.stringify(carrito));
                actualizarCarrito();
            }
        });
    });
}

// Cargar el carrito si estamos en carrito.html
if (carritoBody) {
    actualizarCarrito();
}

// Redirigir a la página de registro de datos al proceder al pago
document.getElementById('checkout')?.addEventListener('click', () => {
    window.location.href = "registro.html";
});
