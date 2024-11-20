import { Fragment, useState, useEffect } from "react";
import Formulario from "./components/Formulario";
import Cita from "./components/Cita";

function App () {

  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const citasGuardadas = JSON.parse(localStorage.getItem('citas'));
    if (citasGuardadas) {
      setCitas(citasGuardadas);
    }
  }, []);

  const guardarCitas = (nuevasCitas) => {
    localStorage.setItem('citas', JSON.stringify(nuevasCitas));
    setCitas(nuevasCitas);
  };

  const crearCita = cita => {
    const nuevasCitas = [...citas, cita];
    guardarCitas(nuevasCitas);
  }

  const eliminarCita = id => {
    const citasBorradas = citas.filter(cita => cita.id !== id);
    guardarCitas(citasBorradas);
  }

  //Mensaje condicional
  const titulo = citas.length === 0 ? "No hay citas" : "Listado de citas"

  return (
    <Fragment>
      <div className="top-bar">
        <h4 className="subtitulo">Veterinaria</h4>
        <h4 className="nombre-veterinaria">El Dogo</h4>
      </div>
      <h1>Administrador de turnos</h1>
      <div className="container">
        <div className="row">
          <div className="one-half column">
            <Formulario
              crearCita={crearCita}
            />
          </div>
          <div className="one-half column">
            <h2>{titulo}</h2>
            {citas.map(cita => (
              <Cita
                key={cita.id}
                cita={cita}
                eliminarCita={eliminarCita}
              />
            ))}
          </div>
        </div>
      </div>
    </Fragment>

  )
}



export default App;
