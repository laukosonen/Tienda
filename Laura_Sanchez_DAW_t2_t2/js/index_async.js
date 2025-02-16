let arrayProductos=[];
let listaResumida=[];
let filtrados=[];
let carrito=[];
let total=null;
let contenidoColumnaCarrito=document.querySelector("#contenidoColumnaCarrito");
let espacioCartas=document.querySelector(".rowCartas");
let precioTotal=document.querySelector("#precioTotal");


let url="https://dummyjson.com/products";

//Establecemos una promesa a través del await para la función de obtención de los productos de la api de manera asíncrona 
async function obtenerProductos(url){
    let respuesta=await fetch(url);
    console.log(respuesta);
    let json=await respuesta.json();
    arrayProductos=json.products;
    for (const element of arrayProductos) {
        //creo el array "listaResumida" que recoge todos los productos de la api pero sólo con los atributos que son de mi interés (nombre, precio, categoría y marca del producto)
        listaResumida.push(new product(element.title,element.price,element.category,element.brand));
    }
}

obtenerProductos(url);

//Cada vez que se hace click en el botón filtrar se analiza el valor que hay seleccionado en las 3 categorías de filtro para pintar el resultado en base a todas ellas
function filtrarProductos(){
    let minPrice=precioMinimo.value;
    let category=categoriaProducto.value;
    let brand=marca.value;
    filtrados=listaResumida;
   
     //filtro por precio mínimo de producto
    if(minPrice=="all"){
        filtrados=filtrados;
    }   
    else if(minPrice=="min1"){
        filtrados=filtrados.filter((item)=>item.precio>=0.99);
    }else if(minPrice=="min2"){
        filtrados=filtrados.filter((item)=>item.precio>=6);
    }else if(minPrice=="min3"){
        filtrados=filtrados.filter((item)=>item.precio>=10);
    }else if(minPrice=="min4"){
        filtrados=filtrados.filter((item)=>item.precio>=20);
    }else if(minPrice=="min5"){
        filtrados=filtrados.filter((item)=>item.precio>=50); 
    }else{
        filtrados=filtrados.filter((item)=>item.precio>=200); 
    }
    

    //filtro por categoría de producto
    if(category!="all" && category!="undefined"){
        filtrados=filtrados.filter((item)=>item.categoria==category);
    }
    else if(category=="undefined"){
        filtrados=filtrados.filter((item)=>item.categoria==undefined);
    }
    else {
        filtrados=filtrados;
        console.log("Entrando por todas las categorias");
        
    }

     //filtro por marca de producto
    if(brand!="all" && brand!="undefined"){
        filtrados=filtrados.filter((item)=>item.marca==brand);
    }
    else if(brand=="undefined"){
        filtrados=filtrados.filter((item)=>item.marca==undefined);
    }

    //Antes de mostrar el resultado del filtro se borra el contenido que hubiera anteriormente y se pinta el nuevo:
    borrarContenido();
    mostrarContenido(filtrados);
    
    
}
  
    
function borrarContenido(){
    espacioCartas.innerHTML="";

}

function mostrarContenido(filtrados){
    for (const element of filtrados) {
        /*Como en las imágenes necesito el nombre del producto sin espacios elimino los espacios que por defecto viene en los nombres de los productos
         para poder llamar a cada imagen de cada producto*/
        let nombreSinEspacios = (element.nombre).replace(/\s+/g,"");
        let nombreCategoria=traducirCategoria(element.categoria);
        
;       espacioCartas.innerHTML+=`
            <div class="card m-0 p-0 me-3 mb-3 text-center animate__animated animate__fadeInDown" style="width: 18rem; height:30rem;">
            <img src="./img/${nombreSinEspacios}.jpg" class="card-img-top" alt="Imagen_/${nombreSinEspacios}">
            <div class="card-body">
                <h5 class="card-title">${element.nombre}</h5>
                <h5 class="card-title">${element.precio}€</h5>
                <p class="card-text">${nombreCategoria}</p>
                <input type="button" value="Agregar al carrito" id="botonAgregar" onclick="agregarACarrito('${element.nombre}')">
            </div>
            </div>
    `
    }  
}

//Añado esta función para poder mostrar el nombre de las categorías, que por defecto vienen en inglés en la api, al español:
function traducirCategoria(categoryName){
    let nombreCategoria=null;
    if(categoryName=="beauty"){
        nombreCategoria="Cosmética y belleza";
    }
    else if(categoryName=="fragrances"){
        nombreCategoria="Fragancias";
    }
    else if(categoryName=="furniture"){
        nombreCategoria="Muebles";
    }
    else{
        nombreCategoria="Alimentación";
    }
    return nombreCategoria;
}



function agregarACarrito(nombre){
    console.log("Agregando producto a carrito");
    
    for (const element of filtrados) {
        if(element.nombre==nombre){
            carrito.push(element);
            agregarNodo(element.nombre,element.precio);
        }
    }

    //Cada vez que el usuario añade un producto al carrito se recalcula el precio total del carrito
    total=calcularPrecioTotal();
    precioTotal.innerHTML=`Total: ${total}€`
    
}

function eliminarDeCarrito(nombre){
    carrito=carrito.filter((item)=>item.nombre!=nombre);
    contenidoColumnaCarrito.innerHTML="";
    for (const element of carrito) {
        
            agregarNodo(element.nombre,element.precio);
            
        }
    //Cada vez que el usuario elimina un producto al carrito se recalcula el precio total del carrito
    total=calcularPrecioTotal();
    precioTotal.innerHTML=`Total: ${total}€`
        
    }

    //Utilizo sweet alert para el mensaje de confirmación de la compra
    function realizarCompra(total){
        Swal.fire({
            title: `Vas a realizar una compra por valor de ${total}€`,
            text: "¿Estás seguro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#18668",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, quiero comprar"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "¡Compra realizada con éxito!",
                icon: "success",
              });
              contenidoColumnaCarrito.innerHTML="";
              precioTotal.innerHTML="";
            }
          });

    }


    //Para que la aparición de cada producto añadido al carrito sea individual y no con el resto de productos del carrito a la vez hago uso de append en lugar de innerHTML
    function agregarNodo(nombre,precio){
    
    let espacioCarrito = document.createElement('div');
    let nombreProductoAnadido=document.createElement('p');
    nombreProductoAnadido.innerText=nombre;
    let precioProductoAnadido=document.createElement('p');
    precioProductoAnadido.innerText=`${precio}€`;
    let botonEliminar=document.createElement('button');
    botonEliminar.innerText='Eliminar';
    botonEliminar.setAttribute('id','botonEliminar');
    botonEliminar.setAttribute('onclick', `eliminarDeCarrito('${nombre}')`);
    espacioCarrito.className='tarjetaCarrito animate__animated animate__zoomIn';
    espacioCarrito.append(nombreProductoAnadido);
    espacioCarrito.append(precioProductoAnadido);
    espacioCarrito.append(botonEliminar);
  
    contenidoColumnaCarrito.appendChild(espacioCarrito);
  
    }

function calcularPrecioTotal(){
    let precioTotal=0;
    let precio=0;
    for (const element of carrito) {
        precio+=element.precio;
        precioTotal=parseFloat(precio.toFixed(2));
    }
    return precioTotal;
}







    
 
    
