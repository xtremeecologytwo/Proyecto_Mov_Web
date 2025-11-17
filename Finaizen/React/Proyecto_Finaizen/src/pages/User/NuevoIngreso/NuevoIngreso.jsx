import TransactionForm from '../../../components/forms/TransactionForm';

/**
 * NuevoIngreso - Página para registrar un nuevo ingreso
 * Utiliza el componente TransactionForm reutilizable
 */
function NuevoIngreso() {
  const handleSuccess = (ingreso) => {
    console.log('Ingreso creado exitosamente:', ingreso);
  };

  return (
    <TransactionForm 
      type="ingreso"
      onSubmitSuccess={handleSuccess}
    />
  );
}

export default NuevoIngreso;
