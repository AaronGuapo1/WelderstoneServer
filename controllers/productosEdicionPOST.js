const Producto = require('../models/Productos.js');
const path = require('path');
const material = require('../models/materiales.js');
const Cart = require("../models/Cart");

module.exports =  async (req,res)=>{   

  

  
    if(req.body.Familia !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{Familia:req.body.Familia}});

    }

    if(req.body.descripcion !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{descripcion:req.body.descripcion}});
    }
    if(req.body.Codigo !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{Codigo:req.body.Codigo}});
    }
    if(req.body.unidad !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{unidad:req.body.unidad}});
    }
    if(req.body.ManoObMaterial !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{ManoObMaterial:req.body.ManoObMaterial}});
    }
    if(req.body.PorcentajeMaterial !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{PorcentajeMaterial:req.body.PorcentajeMaterial}});
    }
    if(req.body.ManoObPintura !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{ManoObPintura:req.body.ManoObPintura}});
    }
    if(req.body.PorcentajePintura !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{PorcentajePintura:req.body.PorcentajePintura}});
    }
    if(req.body.ManoObInstalacion !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{ManoObInstalacion:req.body.ManoObInstalacion}});
    }

    if(req.body.PorcentajeInstalacion !== '' ){
        await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{PorcentajeInstalacion:req.body.PorcentajeInstalacion}});
    }





  

    await Producto.updateOne({nombre:req.body.NombreBusqueda}, {$unset: {especificacionesNombre:1}} , {multi: true});

        await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $set: {especificacionesNombre:req.body.especificacionesNombre}});      

            await Producto.updateOne({nombre:req.body.NombreBusqueda}, {$unset: {especificacionesDesc:1}} , {multi: true});

                await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $set: {especificacionesDesc:req.body.especificacionesDesc}});      


                await Producto.updateOne({nombre:req.body.NombreBusqueda}, {$unset: {MaterialesProductos:1}} , {multi: true});



    for (a=0; a<req.body['MaterialesProductos[cantidad]'].length;a++){
     

     if (req.body['MaterialesProductos[cantidad]'][a]> 0){
        await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $push: {MaterialesProductos:{Descripcion:req.body['MaterialesProductos[nombre]'][a],cantidad:req.body['MaterialesProductos[cantidad]'][a],Codigo:req.body['MaterialesProductos[Codigo]'][a],Familia:req.body['MaterialesProductos[Familia]'][a]}}});
    
     }
        
    }
    
    await Producto.updateOne({nombre:req.body.NombreBusqueda}, {$unset: {PinturaProductos:1}} , {multi: true});

    for (b=0; b<req.body['PinturaProductos[cantidad]'].length;b++){
        if (req.body['PinturaProductos[cantidad]'][b]> 0){

        await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $push: {PinturaProductos:{Descripcion:req.body['PinturaProductos[nombre]'][b],cantidad:req.body['PinturaProductos[cantidad]'][b],Codigo:req.body['PinturaProductos[Codigo]'][b],Familia:req.body['PinturaProductos[Familia]'][b]}}});
        }
    }

    await Producto.updateOne({nombre:req.body.NombreBusqueda}, {$unset: {InstalacionProductos:1}} , {multi: true});

    for (c=0; c<req.body['InstalacionProductos[cantidad]'].length;c++){
        if (req.body['InstalacionProductos[cantidad]'][c]> 0){

        await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $push: {InstalacionProductos:{Descripcion:req.body['InstalacionProductos[nombre]'][c],cantidad:req.body['InstalacionProductos[cantidad]'][c],Codigo:req.body['InstalacionProductos[Codigo]'][c],Familia:req.body['InstalacionProductos[Familia]'][c]}}});
        }
    }
    



    const productos = await Producto.find({});

    console.log(productos)

    const materiales = await material.find({});
    
    for (let a =0; a< productos.length; a++){
    
    const {MaterialesProductos} = productos[a];
    const {PinturaProductos} = productos[a];
    const {InstalacionProductos} = productos[a];
    
    
    var suma = 0;
    
    for (let i=0; i<MaterialesProductos.length; i++){
            if (MaterialesProductos[i].Descripcion === materiales[i].Descripcion && materiales[i].PrecioUnitario >= 0 ){
             suma = suma + (MaterialesProductos[i].cantidad *  materiales[i].PrecioUnitario)
            }
    }
    var Suma2Mano= ((suma * productos[a].ManoObMaterial)/100) + suma;
    var Suma3Por= ((Suma2Mano * productos[a].PorcentajeMaterial)/100) +Suma2Mano;
    
    var sumaSolventes = 0;
    
    for (let i=0; i<PinturaProductos.length; i++){
            if (PinturaProductos[i].Descripcion === materiales[i].Descripcion && materiales[i].PrecioUnitario >= 0 ){
                sumaSolventes = sumaSolventes + (PinturaProductos[i].cantidad *  materiales[i].PrecioUnitario)
            }
    }
    var sumaSolventes2Mano= ((sumaSolventes * productos[a].ManoObPintura)/100) + sumaSolventes;
    var sumaSolventes3Por=((sumaSolventes2Mano * productos[a].PorcentajePintura)/100) +sumaSolventes2Mano;
    
    var sumaInsumos = 0;
    
    for (let i=0; i<InstalacionProductos.length; i++){
        if (InstalacionProductos[i].Descripcion === materiales[i].Descripcion && materiales[i].PrecioUnitario >= 0 ){
            sumaInsumos = sumaInsumos + (InstalacionProductos[i].cantidad *  materiales[i].PrecioUnitario)
        }
    }
    var sumaInsumos2Mano = ((sumaInsumos * productos[a].ManoObInstalacion)/100) + sumaInsumos;
    var sumaInsumos3Por = ((sumaInsumos * productos[a].PorcentajeInstalacion)/100) + sumaInsumos2Mano;
    
    var x = Suma3Por+sumaSolventes3Por+sumaInsumos3Por;
    var SubTotal=Number(x.toFixed(2))

    //console.log(SubTotal)
    
    await Producto.updateOne({_id:productos[a]._id},{ $set: { precio:SubTotal } });
    await Cart.update({nombre:productos[a].nombre},{$set: { precio:SubTotal } });

    
    }
    
    try {


        var image = req.files.image;
        console.log(image)

        image.mv(path.resolve(__dirname,'..','public/images/productos',image.name),async (error)=>{

            await Producto.updateOne({nombre:req.body.NombreBusqueda},{ $set:{ image: '/images/productos/' + image.name}});
            await Cart.update({nombre:req.body.NombreBusqueda},{ $set:{ image: '/images/productos/' + image.name}});

        })
    }
    

    

    catch (error) {

    }
    finally {

        if(req.body.nombre !== '' ){
            await Producto.updateOne({nombre:req.body.NombreBusqueda},{$set:{nombre:req.body.nombre}});
            await Cart.update({nombre:req.body.NombreBusqueda},{$set:{nombre:req.body.nombre}});
    
        }

        res.redirect('/productos')

    }
    
 
}
    



/*

    for (a=0; a<req.body['MaterialesProductos[cantidad]'].length;a++){
     

     if (req.body['MaterialesProductos[cantidad]'][a]> 0){
        await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $set: {"MaterialesProductos.$[item]":{Descripcion:req.body['MaterialesProductos[nombre]'][a],cantidad:req.body['MaterialesProductos[cantidad]'][a],Codigo:req.body['MaterialesProductos[Codigo]'][a],Familia:req.body['MaterialesProductos[Familia]'][a]}}}, {arrayFilters: [{"item.Codigo":req.body['MaterialesProductos[Codigo]'][a]}]});
    
     }
        
    }
    
    await Producto.updateOne({nombre:req.body.NombreBusqueda}, {$unset: {PinturaProductos:1}} , {multi: true});

    for (b=0; b<req.body['PinturaProductos[cantidad]'].length;b++){
        if (req.body['PinturaProductos[cantidad]'][b]> 0){

        await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $set: {"PinturaProductos.$[item]":{Descripcion:req.body['PinturaProductos[nombre]'][b],cantidad:req.body['PinturaProductos[cantidad]'][b],Codigo:req.body['PinturaProductos[Codigo]'][b],Familia:req.body['PinturaProductos[Familia]'][b]}}}, {arrayFilters: [{"item.Codigo":req.body['PinturaProductos[Codigo]'][b]}]});
        }
    }
    
    await Producto.updateOne({nombre:req.body.NombreBusqueda}, {$unset: {InstalacionProductos:1}} , {multi: true});

    for (c=0; c<req.body['InstalacionProductos[cantidad]'].length;c++){
        if (req.body['InstalacionProductos[cantidad]'][c]> 0){

        await Producto.updateOne({nombre:req.body.NombreBusqueda}, { $set: {"InstalacionProductos.$[item]":{Descripcion:req.body['InstalacionProductos[nombre]'][c],cantidad:req.body['InstalacionProductos[cantidad]'][c],Codigo:req.body['InstalacionProductos[Codigo]'][c],Familia:req.body['InstalacionProductos[Familia]'][c]}}}, {arrayFilters: [{"item.Codigo":req.body['InstalacionProductos[Codigo]'][c]}]});
        }
    }
    


*/