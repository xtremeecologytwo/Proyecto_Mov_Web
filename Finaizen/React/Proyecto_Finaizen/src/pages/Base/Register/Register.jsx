import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Navbar, Footer } from '../../../components/layout';
import { Button, Input, SocialButton } from '../../../components/ui';
import styles from './Register.module.css';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    email: '', 
    username: '', 
    password: '', 
    confirmPassword: '', 
    birthdate: '', 
    country: 'Ecuador', // País obligatorio
    terms: false, 
    notifications: false,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación completa
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'El nombre es requerido';
    if (!formData.lastName) newErrors.lastName = 'El apellido es requerido';
    if (!formData.email) newErrors.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Correo inválido';
    if (!formData.username) newErrors.username = 'El nombre de usuario es requerido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!formData.birthdate) newErrors.birthdate = 'La fecha de nacimiento es requerida';
    if (!formData.terms) newErrors.terms = 'Debes aceptar los términos y condiciones';

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Registro real con mockDB
      const result = register({
        nombre: formData.firstName,
        apellido: formData.lastName,
        correo: formData.email,
        nombreUsuario: formData.username,
        contraseña: formData.password,
        pais: formData.country,
        fechaNacimiento: formData.birthdate,
      });

      if (result.success) {
        setMessageType('success');
        setMessage('¡Registro exitoso! Redirigiendo al dashboard...');
        
        // Redirigir al dashboard después de 1 segundo
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setMessageType('error');
        setMessage(result.message || 'Error al registrar. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <div className={styles.registerPage}>
      <Navbar />

      <section className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <div className={styles.registerHeader}>
            <h1>Crea tu cuenta</h1>
            <p>Únete a Finaizen y comienza a organizar tus finanzas</p>
          </div>

          {/* Mensaje de notificación */}
          {message && (
            <div className={`${styles.messageBanner} ${styles[messageType]}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.registerForm}>
            <div className={styles.grid2}>
              <Input label="Nombre" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <Input label="Apellido" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>

            <Input label="Correo electrónico" type="email" name="email" value={formData.email} onChange={handleChange} required error={errors.email} />
            <Input label="Nombre de usuario" name="username" value={formData.username} onChange={handleChange} required />
            <Input label="Contraseña" type="password" name="password" value={formData.password} onChange={handleChange} required error={errors.password} />
            <Input label="Confirmar contraseña" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required error={errors.confirmPassword} />

            <div className={styles.grid2}>
              <div>
                <label className={styles.selectLabel}>Fecha de nacimiento</label>
                <input className={styles.selectField} type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
              </div>
              <div>
                <label className={styles.selectLabel}>País</label>
                <select name="country" value={formData.country} onChange={handleChange} className={styles.selectField} required>
                  <option value="Ecuador">�� Ecuador</option>
                  <option value="México">🇲🇽 México</option>
                  <option value="Colombia">🇴 Colombia</option>
                  <option value="Perú">�� Perú</option>
                  <option value="Argentina">�� Argentina</option>
                  <option value="Chile">🇨� Chile</option>
                  <option value="Venezuela">�🇪 Venezuela</option>
                  <option value="España">🇪🇸 España</option>
                  <option value="Estados Unidos">�🇸 Estados Unidos</option>
                </select>
              </div>
            </div>

            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} required />
              Acepto los términos y condiciones y la política de privacidad
            </label>

            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="notifications" checked={formData.notifications} onChange={handleChange} />
              Deseo recibir notificaciones y promociones por correo electrónico
            </label>

            <Button type="submit" variant="brand" className={styles.wFull}>Crear Cuenta</Button>

            <div className={styles.divider}><span>O regístrate con</span></div>
            <div className={styles.socialButtons}>
              <SocialButton provider="google" />
              <SocialButton provider="facebook" />
            </div>

            <div className={styles.registerFooter}>
              <p>¿Ya tienes una cuenta? <Link to="/login" className={styles.loginLink}>Inicia sesión aquí</Link></p>
            </div>
          </form>
        </div>
      </section>

      <Footer simple />
    </div>
  );
}

export default Register;
