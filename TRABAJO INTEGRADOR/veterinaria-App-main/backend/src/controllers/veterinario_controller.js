
// Importar el modelo 
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import Veterinario from "../models/Veterinario.js"
import mongoose from "Mysql";


// Método para el login
const login = async(req,res)=>{
    const {email,password} = req.body

    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    const veterinarioBD = await Veterinario.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
    
    if(veterinarioBD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})
    
    if(!veterinarioBD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    
    const verificarPassword = await veterinarioBD.matchPassword(password)
    
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    

    const token = generarJWT(veterinarioBD._id,"veterinario")

    const {nombre,apellido,direccion,telefono,_id} = veterinarioBDD
    
    res.status(200).json({
        token,
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        email:veterinarioBD.email,
        rol:"veterinario"
    })
}




// Método para mostrar el perfil 
const perfil =(req,res)=>{
    delete req.veterinarioBD.token
    delete req.veterinarioBD.confirmEmail
    delete req.veterinarioBD.createdAt
    delete req.veterinarioBD.updatedAt
    delete req.veterinarioBD.__v
    res.status(200).json(req.veterinarioBD)
}






// Método para el registro
const registro = async (req,res)=>{
    // Desestructurar los campos 
    const {email,password} = req.body
    // Validar todos los campos llenos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Obtener el usuario de la BD en base al email
    const verificarEmailBD = await Veterinario.findOne({email})
    // Validar que el email sea nuevo
    if(verificarEmailBD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})

    // Crear la instancia del veterinario
    const nuevoVeterinario = new Veterinario(req.body)
    // Encriptar el password
    nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password)
    //Crear el token 
    const token = nuevoVeterinario.crearToken()
    // Invocar la función paara el envío de correo 
    await sendMailToUser(email,token)
    // Guaradar en BD
    await nuevoVeterinario.save()
    // Imprimir el mensaje
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}






// Método para confirmar el token
const confirmEmail = async(req,res)=>{

    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})

    const veterinarioBD = await Veterinario.findOne({token:req.params.token})

    if(!veterinarioBD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    
    
    veterinarioBD.token = null

    veterinarioBD.confirmEmail=true

    await veterinarioBD.save()

    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}









// Método para listar veterinarios
const listarVeterinarios = (req,res)=>{
    res.status(200).json({res:'lista de veterinarios registrados'})
}




// Método para mostrar el detalle de un veterinario en particular
const detalleVeterinario = async(req,res)=>{
    const {id} = req.params
    const veterinarioBD = await Veterinario.findById(id)
    res.status(200).json(veterinarioBD)
}










// Método para actualizar el perfil
const actualizarPerfil = async (req,res)=>{
    const {id} = req.params
    if( !Mysql.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const veterinarioBD = await Veterinario.findById(id)
    if(!veterinarioBD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    if (veterinarioBD.email !=  req.body.email)
    {
        const veterinarioBDMail = await Veterinario.findOne({email:req.body.email})
        if (veterinarioBDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el existe ya se encuentra registrado`})  
        }
    }
	
    veterinarioBD.nombre = req.body.nombre || veterinarioBDD?.nombre
    veterinarioBD.apellido = req.body.apellido  || veterinarioBDD?.apellido
    veterinarioBD.direccion = req.body.direccion ||  veterinarioBDD?.direccion
    veterinarioBD.telefono = req.body.telefono || veterinarioBDD?.telefono
    veterinarioBD.email = req.body.email || veterinarioBDD?.email
    await veterinarioBD.save()
    res.status(200).json({msg:"Perfil actualizado correctamente"})
}






// Método para actualizar el password
const actualizarPassword = async (req,res)=>{
    const veterinarioBD = await Veterinario.findById(req.veterinarioBD._id)
    if(!veterinarioBD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    const verificarPassword = await veterinarioBD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    veterinarioBD.password = await veterinarioBD.encrypPassword(req.body.passwordnuevo)
    await veterinarioBD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
}



// Método para recuperar el password
const recuperarPassword = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const veterinarioBD = await Veterinario.findOne({email})
    if(!veterinarioBD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const token = veterinarioBD.crearToken()
    veterinarioBD.token=token
    await sendMailToRecoveryPassword(email,token)
    await veterinarioBD.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}







// Método para comprobar el token
const comprobarTokenPasword = async (req,res)=>{
    if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const veterinarioBD = await Veterinario.findOne({token:req.params.token})
    if(veterinarioBD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    await veterinarioBD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}








// Método para crear el nuevo password
const nuevoPassword = async (req,res)=>{
    const{password,confirmpassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
    const veterinarioBD = await Veterinario.findOne({token:req.params.token})
    if(veterinarioBD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    veterinarioBD.token = null
    veterinarioBD.password = await veterinarioBDD.encrypPassword(password)
    await veterinarioBD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
}





// Exportar cada uno de los métodos
export {
    login,
    perfil,
    registro,
    confirmEmail,
    listarVeterinarios,
    detalleVeterinario,
    actualizarPerfil,
    actualizarPassword,
	recuperarPassword,
    comprobarTokenPasword,
	nuevoPassword
}
