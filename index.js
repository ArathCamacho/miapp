document.addEventListener('DOMContentLoaded', () => {
    const userIcon = document.getElementById('user-icon');
    const userForm = document.getElementById('user-form');
    const closeFormButton = document.getElementById('close-form');
    const btnCart = document.querySelector('.container-cart-icon');
    const containerCartProducts = document.querySelector('.container-cart-products');
    const valorTotal = document.querySelector('.total-pagar');
    const countProducts = document.querySelector('#contador-productos');
    const cartEmpty = document.querySelector('.cart-empty');
    const rowProduct = document.querySelector('.row-product');
    const payButton = document.getElementById('pay-button');

    // Arreglo para almacenar productos en el carrito
    let allProducts = [];

    // Mostrar u ocultar el carrito al hacer clic en el ícono del carrito
    btnCart.addEventListener('click', () => {
        containerCartProducts.classList.toggle('hidden-cart');
    });

    // Función para mostrar el carrito
    const showCart = () => {
        // Actualizar contador de productos en el carrito
        countProducts.textContent = allProducts.reduce((total, product) => total + product.quantity, 0).toString();

        // Mostrar los productos en el carrito y actualizar el total
        if (allProducts.length === 0) {
            cartEmpty.classList.remove('hidden');
            rowProduct.classList.add('hidden');
            valorTotal.textContent = '$0.00'; // Reiniciar el total a $0.00 si no hay productos
            payButton.classList.add('hidden'); // Ocultar botón de pagar si el carrito está vacío
        } else {
            cartEmpty.classList.add('hidden');
            rowProduct.classList.remove('hidden');
            payButton.classList.remove('hidden'); // Mostrar botón de pagar si hay productos en el carrito
        }

        rowProduct.innerHTML = '';

        let total = 0;

        allProducts.forEach((product) => {
            const containerProduct = document.createElement('div');
            containerProduct.classList.add('cart-product');

            containerProduct.innerHTML = `
                <div class="info-cart-product">
                    <span class="cantidad-producto-carrito">${product.quantity}</span>
                    <p class="titulo-producto-carrito">${product.title}</p>
                    <span class="precio-producto-carrito">$${(product.price * product.quantity).toFixed(2)}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            `;

            rowProduct.appendChild(containerProduct);

            total += product.price * product.quantity;
        });

        valorTotal.textContent = `$${total.toFixed(2)}`;
    };

    // Agregar productos al carrito
    document.querySelectorAll('.btn-add-cart').forEach((button) => {
        button.addEventListener('click', (e) => {
            const product = e.target.closest('.item');
            const infoProduct = {
                quantity: 1,
                title: product.querySelector('h2').textContent,
                price: parseFloat(product.querySelector('.price').textContent.replace('$', '')),
            };

            const index = allProducts.findIndex((p) => p.title === infoProduct.title);

            if (index !== -1) {
                allProducts[index].quantity++;
            } else {
                allProducts.push(infoProduct);
            }

            showCart(); // Mostrar el carrito actualizado
        });
    });

    // Eliminar producto del carrito
    rowProduct.addEventListener('click', (e) => {
        if (e.target.classList.contains('icon-close')) {
            const product = e.target.closest('.cart-product');
            const title = product.querySelector('.titulo-producto-carrito').textContent;

            allProducts = allProducts.filter((p) => p.title !== title);

            showCart(); // Mostrar el carrito actualizado
        }
    });

    // Evento para el botón Pagar
    payButton.addEventListener('click', () => {
        // Aquí puedes agregar la lógica para procesar el pago
        alert('Procesando pago...');
        // Por ejemplo, podrías redirigir a una página de pago o realizar alguna acción de pago
    });

    // Mostrar el carrito inicialmente
    showCart();

    // Mostrar formulario de usuario al hacer clic en el icono de usuario
    userIcon.addEventListener('click', () => {
        userForm.classList.toggle('hidden-form');
    });

    // Cerrar formulario de usuario al hacer clic en el botón "Cerrar"
    closeFormButton.addEventListener('click', () => {
        userForm.classList.add('hidden-form');
    });
});

// Configurar el puerto para Heroku
const port = process.env.PORT || 3000;

// Iniciar el servidor en el puerto configurado
app.listen(port, () => {
    console.log(`Servidor encendido en http://localhost:${port}`);
});
