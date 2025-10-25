import { useState } from "react";
import supabase from "../../utils/supabase";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setMensaje("Error al enviar el correo: " + error.message);
        setSuccess(false);
      } else {
        setMensaje(
          "¡Correo enviado! Revisa tu bandeja de entrada para restablecer tu contraseña."
        );
        setSuccess(true);
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error inesperado. Intenta de nuevo.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎓</span>
            <h1 className="font-bold text-xl text-gray-800">UniCourses</h1>
          </div>
          <nav className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-teal-600 transition-colors"
            >
              Ayuda
            </a>
            <a
              href="/login"
              className="text-sm px-4 py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Iniciar sesión
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Info Section */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Recuperación de cuenta segura
            </div>

            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              ¿Olvidaste tu contraseña?
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              No te preocupes, te enviaremos un enlace seguro para restablecer
              tu contraseña.
            </p>

            {/* Info steps */}
            <div className="space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <span className="text-teal-700 font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Ingresa tu correo
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Escribe el correo electrónico asociado a tu cuenta
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Revisa tu correo
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Te enviaremos un enlace de recuperación de forma inmediata
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-700 font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Crea una nueva contraseña
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Haz click en el enlace y establece tu nueva contraseña
                  </p>
                </div>
              </div>
            </div>

            {/* Security note */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex gap-3">
              <svg
                className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-teal-900">
                  Proceso 100% seguro
                </p>
                <p className="text-xs text-teal-700 mt-1">
                  El enlace expira en 1 hora por tu seguridad
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Reset Password Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10">
            {success ? (
              // Success state
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    ¡Correo enviado!
                  </h3>
                  <p className="text-gray-600">
                    Revisa tu bandeja de entrada y sigue las instrucciones para
                    restablecer tu contraseña.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Si no ves el correo, revisa tu
                    carpeta de spam o correo no deseado.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setMensaje("");
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Enviar de nuevo
                  </button>

                  <a
                    href="/login"
                    className="text-center text-sm text-teal-600 hover:underline font-semibold"
                  >
                    Volver al inicio de sesión
                  </a>
                </div>
              </div>
            ) : (
              // Form state
              <>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Recuperar contraseña
                  </h3>
                  <p className="text-gray-600">
                    Ingresa tu correo electrónico y te enviaremos un enlace
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  {/* Email input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="tu@correo.com"
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`
                      w-full py-3 rounded-lg font-semibold
                      transition-all duration-200 shadow-lg
                      flex items-center justify-center gap-2
                      ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 hover:shadow-xl"
                      }
                      text-white
                    `}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Enviar enlace de recuperación
                      </>
                    )}
                  </button>

                  {/* Error message */}
                  {mensaje && !success && (
                    <div className="p-4 rounded-lg text-sm font-medium text-center bg-red-50 text-red-700 border border-red-200">
                      {mensaje}
                    </div>
                  )}
                </form>

                {/* Back to login */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
                    ¿Recordaste tu contraseña?{" "}
                    <a
                      href="/login"
                      className="text-teal-600 hover:underline font-semibold"
                    >
                      Inicia sesión aquí
                    </a>
                  </p>
                </div>

                {/* Register link */}
                <p className="text-center text-sm text-gray-600 mt-4">
                  ¿No tienes cuenta?{" "}
                  <a
                    href="/register"
                    className="text-teal-600 hover:underline font-semibold"
                  >
                    Regístrate gratis
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-600">
          <p>© 2025 UniCourses. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
