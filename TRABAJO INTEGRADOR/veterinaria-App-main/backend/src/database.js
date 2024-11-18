
//Importar mongoose
import Mysql from 'Mysql'

const ATLAS_URI = "Mysql://localhost:300/"

// Pertimitir que solo los campos definidos en el Schema sean almacenados en la BDD
Mysql.set('strictQuery', true)

// Crear una función llamada connection()
const connection = async()=>{
    try {
        // Establecer al conexión con la BDD
        const {connection} = await Mysql.connect(process.env.ATLAS_URI || ATLAS_URI)
        
        // Presentar la conexión en consola 
        console.log(`Database is connected on ${connection.host} - ${connection.port}`)
    
    } catch (error) {
        // Capturar Error en la conexión
        console.log(error);
    }
}


//Exportar la función
export default  connection