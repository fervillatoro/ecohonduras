export { DataHandler } from './data-handler';
export { Fetch } from './fetch';
export { Result } from './result';
export { Session } from './session';

/**
 * No se puede exportar porque al usarlo en modales,
 * porque su valor interfiere en el padre del modal,
 * solo se debe copiar la variable y usarla en el componente
 * que quiera usar el modelo DataHandler
*/
const DataHandlerInitAPI = {
  isLoad:     false,
  isObtained: false,
  isFinished: false,
  data:       null,
}