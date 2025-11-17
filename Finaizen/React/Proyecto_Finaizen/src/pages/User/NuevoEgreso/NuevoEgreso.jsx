import TransactionForm from '../../../components/forms/TransactionForm';

/**
 * NuevoEgreso - Página para registrar un nuevo egreso
 * Utiliza el componente TransactionForm reutilizable
 */
function NuevoEgreso() {
  const handleSuccess = (egreso) => {
    console.log('Egreso creado exitosamente:', egreso);
  };

  return (
    <TransactionForm 
      type="egreso"
      onSubmitSuccess={handleSuccess}
    />
  );
}

export default NuevoEgreso;
