import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  getCourseModules,
  createCourseModule,
  updateCourseModule,
  deleteCourseModule,
  type CourseModule,
} from "../../services/teacherService";
import Toast from "../Toast";

interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export default function CourseModulesView() {
  const { cursoId } = useParams<{ cursoId: string }>();
  const location = useLocation();
  const cursoNombre = location.state?.cursoNombre || "Curso";

  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [formData, setFormData] = useState({ titulo: "", descripcion: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (cursoId) {
      loadModules();
    }
  }, [cursoId]);

  const loadModules = async () => {
    if (!cursoId) return;
    setLoading(true);
    try {
      const data = await getCourseModules(cursoId);
      setModules(data);
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: "Error al cargar módulos",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (module?: CourseModule) => {
    if (module) {
      setEditingModule(module);
      setFormData({ titulo: module.titulo, descripcion: module.descripcion });
    } else {
      setEditingModule(null);
      setFormData({ titulo: "", descripcion: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingModule(null);
    setFormData({ titulo: "", descripcion: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cursoId) return;

    setSubmitting(true);
    try {
      if (editingModule) {
        await updateCourseModule(editingModule.id, formData);
        setToast({ type: "success", message: "Módulo actualizado" });
      } else {
        await createCourseModule(
          cursoId,
          formData.titulo,
          formData.descripcion
        );
        setToast({ type: "success", message: "Módulo creado exitosamente" });
      }
      await loadModules();
      handleCloseModal();
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.message || "Error al guardar módulo",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (moduloId: number) => {
    if (!confirm("¿Estás seguro de eliminar este módulo?")) return;

    try {
      await deleteCourseModule(moduloId);
      setToast({ type: "success", message: "Módulo eliminado" });
      await loadModules();
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.message || "Error al eliminar módulo",
      });
    }
  };

  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg
          className="animate-spin h-10 w-10 text-teal-500"
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{cursoNombre}</h1>
          <p className="text-sm text-gray-600">
            Gestiona los módulos y contenido del curso
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold shadow-sm hover:from-teal-600 hover:to-teal-700 transition-all"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Agregar módulo
        </button>
      </div>

      {/* Modules list */}
      <div className="space-y-4">
        {modules.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-sm mb-4">
              No has creado módulos para este curso.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="text-teal-600 hover:text-teal-700 font-medium text-sm"
            >
              Crear el primer módulo →
            </button>
          </div>
        ) : (
          modules.map((module, index) => (
            <div
              key={module.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 text-sm font-semibold">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {module.titulo}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        module.visible
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {module.visible ? "Visible" : "Oculto"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{module.descripcion}</p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() =>
                      navigate(
                        `/teacher/courses/${cursoId}/modules/${module.id}/content`,
                        {
                          state: { moduloNombre: module.titulo },
                        }
                      )
                    }
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Gestionar contenido"
                  >
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleOpenModal(module)}
                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  >
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(module.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal crear/editar módulo */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white">
                {editingModule ? "Editar módulo" : "Crear nuevo módulo"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del módulo
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Ej: Introducción a la programación"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                  placeholder="Describe el contenido de este módulo..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all text-white ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {submitting
                    ? "Guardando..."
                    : editingModule
                    ? "Actualizar"
                    : "Crear módulo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
