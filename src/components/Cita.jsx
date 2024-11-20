import PropTypes from "prop-types";

const Cita = ({ cita, eliminarCita }) => {

  const { id, mascota, propietario, fecha, hora, sintomas } = cita

  return (
    <div className="cita">
      <p>Mascota:<span> {mascota}</span></p>
      <p>Dueño:<span> {propietario}</span></p>
      <p>Fecha:<span> {fecha}</span></p>
      <p>Hora:<span> {hora} hs</span></p>
      <p>Síntomas:<span> {sintomas}</span></p>

      <button
        className="u-full-width"
        onClick={() => eliminarCita(id)}
      >Eliminar <i className="fa-solid fa-trash-can"></i></button>
    </div>
  )
};


Cita.propTypes = {
  cita: PropTypes.shape({
    id: PropTypes.string.isRequired, // no hace falta
    mascota: PropTypes.string.isRequired,
    propietario: PropTypes.string.isRequired,
    fecha: PropTypes.string.isRequired,
    hora: PropTypes.string.isRequired,
    sintomas: PropTypes.string.isRequired,
  }).isRequired,
  eliminarCita: PropTypes.func.isRequired,
};

export default Cita